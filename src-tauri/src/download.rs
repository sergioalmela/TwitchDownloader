use std::ffi::OsStr;
use std::fmt;
use std::future::Future;
use std::path::{Path, PathBuf};
use std::sync::{Mutex, MutexGuard, PoisonError};
use std::time::Duration;

use bytes::Bytes;
use futures_util::{stream, StreamExt};
use reqwest::{Client, StatusCode};
use tauri::{Emitter, State, WebviewWindow};
use tokio::fs::File;
use tokio::io::{AsyncWriteExt, BufWriter};
use tokio_util::sync::CancellationToken;
use url::Url;

use crate::playlist::{parse_media_playlist, MediaPlaylist, PlaylistError};

const SEGMENT_CONCURRENCY: usize = 6;
const MAX_ATTEMPTS: u32 = 3;
const LIVE_POLL_INTERVAL: Duration = Duration::from_secs(5);

#[derive(Debug)]
enum DownloadError {
    AlreadyRunning,
    Cancelled,
    Cleanup(Box<DownloadError>, std::io::Error),
    EmptyPlaylist,
    Http(StatusCode),
    InvalidArgs(&'static str),
    Io(std::io::Error),
    NothingDownloaded,
    Playlist(PlaylistError),
    Request(reqwest::Error),
    StreamRestarted,
}

impl DownloadError {
    fn is_retryable(&self) -> bool {
        match self {
            DownloadError::Request(_) => true,
            DownloadError::Http(status) => {
                status.is_server_error() || *status == StatusCode::TOO_MANY_REQUESTS
            }
            _ => false,
        }
    }
}

impl fmt::Display for DownloadError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DownloadError::AlreadyRunning => write!(f, "Another download is already running"),
            DownloadError::Cancelled => write!(f, "Download cancelled"),
            DownloadError::Cleanup(cause, err) => {
                write!(f, "{} (cleaning up the file also failed: {})", cause, err)
            }
            DownloadError::EmptyPlaylist => write!(f, "The video has no segments to download"),
            DownloadError::Http(status) => write!(f, "Twitch returned HTTP {}", status),
            DownloadError::InvalidArgs(message) => write!(f, "{}", message),
            DownloadError::Io(err) => write!(f, "Could not write the file: {}", err),
            DownloadError::NothingDownloaded => write!(f, "Nothing was downloaded"),
            DownloadError::Playlist(err) => write!(f, "Invalid playlist: {}", err),
            DownloadError::Request(err) => write!(f, "Network error: {}", err),
            DownloadError::StreamRestarted => {
                write!(f, "The stream restarted, so the recording was stopped")
            }
        }
    }
}

impl From<reqwest::Error> for DownloadError {
    fn from(err: reqwest::Error) -> Self {
        // Segment URLs carry the access token, so keep them out of user-facing errors.
        DownloadError::Request(err.without_url())
    }
}

impl From<std::io::Error> for DownloadError {
    fn from(err: std::io::Error) -> Self {
        DownloadError::Io(err)
    }
}

impl From<PlaylistError> for DownloadError {
    fn from(err: PlaylistError) -> Self {
        DownloadError::Playlist(err)
    }
}

/// Tracks the single download the UI can run at a time, so it can be cancelled.
#[derive(Default)]
pub struct ActiveDownload(Mutex<Option<CancellationToken>>);

impl ActiveDownload {
    fn lock(&self) -> MutexGuard<'_, Option<CancellationToken>> {
        self.0.lock().unwrap_or_else(PoisonError::into_inner)
    }

    fn start(&self) -> Result<CancellationToken, DownloadError> {
        let mut active = self.lock();
        if active.is_some() {
            return Err(DownloadError::AlreadyRunning);
        }
        let token = CancellationToken::new();
        *active = Some(token.clone());
        Ok(token)
    }

    fn finish(&self) {
        *self.lock() = None;
    }

    fn cancel(&self) -> bool {
        match self.lock().as_ref() {
            Some(token) => {
                token.cancel();
                true
            }
            None => false,
        }
    }
}

#[derive(Clone, Copy, PartialEq)]
enum ContentKind {
    Live,
    Vod,
    Clip,
}

#[derive(serde::Deserialize)]
pub struct DownloadArgs {
    m3u8_url: String,
    download_path: String,
    file_name: String,
}

#[tauri::command]
pub async fn download_live(
    args: DownloadArgs,
    window: WebviewWindow,
    active: State<'_, ActiveDownload>,
) -> Result<(), String> {
    run_download(ContentKind::Live, args, &window, &active).await
}

#[tauri::command]
pub async fn download_vod(
    args: DownloadArgs,
    window: WebviewWindow,
    active: State<'_, ActiveDownload>,
) -> Result<(), String> {
    run_download(ContentKind::Vod, args, &window, &active).await
}

#[tauri::command]
pub async fn download_clip(
    args: DownloadArgs,
    window: WebviewWindow,
    active: State<'_, ActiveDownload>,
) -> Result<(), String> {
    run_download(ContentKind::Clip, args, &window, &active).await
}

/// Returns false when no download was running.
#[tauri::command]
pub fn cancel_download(active: State<'_, ActiveDownload>) -> bool {
    active.cancel()
}

async fn run_download(
    kind: ContentKind,
    args: DownloadArgs,
    window: &WebviewWindow,
    active: &ActiveDownload,
) -> Result<(), String> {
    let output_file =
        output_file(&args.download_path, &args.file_name).map_err(|e| e.to_string())?;
    let url = Url::parse(&args.m3u8_url)
        .ok()
        .filter(|url| url.scheme() == "https")
        .ok_or_else(|| "Invalid download URL".to_string())?;
    let client = http_client().map_err(|e| e.to_string())?;
    let token = active.start().map_err(|e| e.to_string())?;
    let progress = |value: f64| {
        let _ = window.emit("download-progress", value);
    };

    let result = match kind {
        ContentKind::Live => record_live(&client, &url, &output_file, &token, progress).await,
        ContentKind::Vod => download_playlist(&client, &url, &output_file, &token, progress).await,
        ContentKind::Clip => download_file(&client, &url, &output_file, &token, progress).await,
    };
    active.finish();

    result.map_err(|e| e.to_string())
}

fn output_file(download_path: &str, file_name: &str) -> Result<PathBuf, DownloadError> {
    let folder = Path::new(download_path);
    if download_path.trim().is_empty() || !folder.is_dir() {
        return Err(DownloadError::InvalidArgs(
            "Choose an existing download folder",
        ));
    }
    if file_name.trim().is_empty()
        || Path::new(file_name).file_name() != Some(OsStr::new(file_name))
    {
        return Err(DownloadError::InvalidArgs(
            "The file name must not be empty or contain folders",
        ));
    }
    Ok(folder.join(file_name))
}

async fn is_empty(path: &Path) -> bool {
    tokio::fs::metadata(path)
        .await
        .map(|metadata| metadata.len() == 0)
        .unwrap_or(true)
}

fn http_client() -> Result<Client, DownloadError> {
    Ok(Client::builder()
        .connect_timeout(Duration::from_secs(10))
        .read_timeout(Duration::from_secs(30))
        .build()?)
}

async fn fetch(client: &Client, url: &Url) -> Result<Bytes, DownloadError> {
    let mut attempt = 1;
    loop {
        match try_fetch(client, url).await {
            Err(err) if attempt < MAX_ATTEMPTS && err.is_retryable() => {
                tokio::time::sleep(Duration::from_millis(500 * u64::from(attempt))).await;
                attempt += 1;
            }
            result => return result,
        }
    }
}

async fn try_fetch(client: &Client, url: &Url) -> Result<Bytes, DownloadError> {
    let response = client.get(url.clone()).send().await?;
    let status = response.status();
    if !status.is_success() {
        return Err(DownloadError::Http(status));
    }
    Ok(response.bytes().await?)
}

async fn fetch_segment(client: &Client, url: &Url) -> Result<Bytes, DownloadError> {
    match fetch(client, url).await {
        Err(DownloadError::Http(status)) if status == StatusCode::FORBIDDEN => {
            match muted_fallback(url) {
                Some(muted_url) => fetch(client, &muted_url).await,
                None => Err(DownloadError::Http(status)),
            }
        }
        result => result,
    }
}

/// Twitch lists some VOD segments as `-unmuted` but only serves the `-muted` copy.
fn muted_fallback(url: &Url) -> Option<Url> {
    let path = url.path();
    if !path.contains("-unmuted") {
        return None;
    }
    let mut muted_url = url.clone();
    muted_url.set_path(&path.replace("-unmuted", "-muted"));
    Some(muted_url)
}

async fn fetch_playlist(client: &Client, url: &Url) -> Result<MediaPlaylist, DownloadError> {
    let body = fetch(client, url).await?;
    Ok(parse_media_playlist(&String::from_utf8_lossy(&body), url)?)
}

async fn until_cancelled<T>(
    token: &CancellationToken,
    future: impl Future<Output = Result<T, DownloadError>>,
) -> Result<T, DownloadError> {
    tokio::select! {
        _ = token.cancelled() => Err(DownloadError::Cancelled),
        result = future => result,
    }
}

async fn create_output(path: &Path) -> Result<BufWriter<File>, DownloadError> {
    Ok(BufWriter::new(File::create(path).await?))
}

/// Flushes the file, or deletes it when the download failed or wrote nothing. Only call
/// this after `create_output`, so a failure never removes a file this download did not
/// write. A failed VOD or clip is unusable, but a live recording keeps what was captured.
async fn close_output(
    mut output: BufWriter<File>,
    path: &Path,
    result: Result<(), DownloadError>,
    keep_partial: bool,
) -> Result<(), DownloadError> {
    let flushed = output.flush().await;
    drop(output);

    let mut result = match (result, flushed) {
        (Ok(()), flushed) => flushed.map_err(DownloadError::from),
        // A kept partial file is missing its tail when the final flush fails.
        (Err(err), Err(flush_err)) if keep_partial => {
            Err(DownloadError::Cleanup(Box::new(err), flush_err))
        }
        (Err(err), _) => Err(err),
    };
    if result.is_ok() && is_empty(path).await {
        result = Err(DownloadError::NothingDownloaded);
    }

    if let Err(cause) = result {
        if !keep_partial || is_empty(path).await {
            if let Err(err) = tokio::fs::remove_file(path).await {
                if err.kind() != std::io::ErrorKind::NotFound {
                    return Err(DownloadError::Cleanup(Box::new(cause), err));
                }
            }
        }
        return Err(cause);
    }
    Ok(())
}

/// Downloads segments in parallel but writes them in playlist order.
async fn write_segments(
    client: &Client,
    urls: Vec<Url>,
    output: &mut BufWriter<File>,
    token: &CancellationToken,
    mut on_written: impl FnMut(usize),
) -> Result<(), DownloadError> {
    let mut segments = stream::iter(urls)
        .map(|url| async move { fetch_segment(client, &url).await })
        .buffered(SEGMENT_CONCURRENCY);
    let mut written = 0;

    loop {
        let next = tokio::select! {
            _ = token.cancelled() => return Err(DownloadError::Cancelled),
            next = segments.next() => next,
        };
        let Some(segment) = next else {
            return Ok(());
        };
        output.write_all(&segment?).await?;
        written += 1;
        on_written(written);
    }
}

async fn download_playlist(
    client: &Client,
    url: &Url,
    output_file: &Path,
    token: &CancellationToken,
    progress: impl Fn(f64),
) -> Result<(), DownloadError> {
    let playlist = until_cancelled(token, fetch_playlist(client, url)).await?;
    if playlist.segments.is_empty() {
        return Err(DownloadError::EmptyPlaylist);
    }

    let mut output = create_output(output_file).await?;
    let result = write_playlist(client, playlist, &mut output, token, progress).await;
    close_output(output, output_file, result, false).await
}

async fn write_playlist(
    client: &Client,
    playlist: MediaPlaylist,
    output: &mut BufWriter<File>,
    token: &CancellationToken,
    progress: impl Fn(f64),
) -> Result<(), DownloadError> {
    if let Some(init_url) = &playlist.init_url {
        let init = until_cancelled(token, fetch(client, init_url)).await?;
        output.write_all(&init).await?;
    }

    let total = playlist.segments.len();
    let urls = playlist.segments.into_iter().map(|s| s.url).collect();
    write_segments(client, urls, output, token, |written| {
        progress(written as f64 / total as f64 * 100.0)
    })
    .await
}

async fn record_live(
    client: &Client,
    url: &Url,
    output_file: &Path,
    token: &CancellationToken,
    progress: impl Fn(f64),
) -> Result<(), DownloadError> {
    // Fetch before creating the file, so an offline channel leaves the disk untouched.
    let first_playlist = until_cancelled(token, fetch_playlist(client, url)).await?;
    let mut output = create_output(output_file).await?;
    let result =
        match record_live_into(client, url, first_playlist, &mut output, token, &progress).await {
            // Stopping is the normal way to finish a live recording.
            Err(DownloadError::Cancelled) => Ok(()),
            result => result,
        };
    close_output(output, output_file, result, true).await?;

    progress(100.0);
    Ok(())
}

async fn record_live_into(
    client: &Client,
    url: &Url,
    first_playlist: MediaPlaylist,
    output: &mut BufWriter<File>,
    token: &CancellationToken,
    progress: &impl Fn(f64),
) -> Result<(), DownloadError> {
    let mut playlist = first_playlist;
    let mut next_sequence: Option<u64> = None;

    loop {
        if sequence_restarted(next_sequence, &playlist) {
            return Err(DownloadError::StreamRestarted);
        }

        let last_sequence = playlist.segments.last().map(|s| s.sequence);
        let new_urls: Vec<Url> = playlist
            .segments
            .into_iter()
            .filter(|s| next_sequence.is_none_or(|next| s.sequence >= next))
            .map(|s| s.url)
            .collect();

        if !new_urls.is_empty() {
            // The init segment is written once; later fragments reuse it.
            if next_sequence.is_none() {
                if let Some(init_url) = &playlist.init_url {
                    let init = until_cancelled(token, fetch(client, init_url)).await?;
                    output.write_all(&init).await?;
                }
            }
            write_segments(client, new_urls, output, token, |_| {}).await?;
            next_sequence = last_sequence.map(|sequence| sequence + 1);
            progress(50.0);
        }

        if playlist.ended {
            return Ok(());
        }

        until_cancelled(token, async {
            tokio::time::sleep(LIVE_POLL_INTERVAL).await;
            Ok(())
        })
        .await?;

        playlist = match until_cancelled(token, fetch_playlist(client, url)).await {
            Ok(playlist) => playlist,
            Err(DownloadError::Http(status))
                if next_sequence.is_some() && is_stream_gone(status) =>
            {
                return Ok(())
            }
            Err(err) => return Err(err),
        };
    }
}

/// Twitch may stop serving the playlist once a stream ends instead of sending ENDLIST.
/// Other client errors (rate limits, expired tokens) are failures, not the end.
fn is_stream_gone(status: StatusCode) -> bool {
    status == StatusCode::NOT_FOUND || status == StatusCode::GONE
}

/// A live window only moves forward. One that ends far behind what was already recorded
/// means the media sequence restarted, and its segments would never pass the filter.
fn sequence_restarted(next_sequence: Option<u64>, playlist: &MediaPlaylist) -> bool {
    match (next_sequence, playlist.segments.last()) {
        (Some(next), Some(last)) => last.sequence + (playlist.segments.len() as u64) < next,
        _ => false,
    }
}

async fn download_file(
    client: &Client,
    url: &Url,
    output_file: &Path,
    token: &CancellationToken,
    progress: impl Fn(f64),
) -> Result<(), DownloadError> {
    let content = until_cancelled(token, fetch(client, url)).await?;

    let mut output = create_output(output_file).await?;
    let result = output
        .write_all(&content)
        .await
        .map_err(DownloadError::from);
    close_output(output, output_file, result, false).await?;
    progress(100.0);

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn temp_folder() -> String {
        std::env::temp_dir().to_string_lossy().into_owned()
    }

    #[test]
    fn output_file_joins_folder_and_name() {
        let folder = temp_folder();
        assert_eq!(
            output_file(&folder, "video.mp4").unwrap(),
            Path::new(&folder).join("video.mp4")
        );
    }

    #[test]
    fn output_file_rejects_missing_folder() {
        assert!(matches!(
            output_file("", "video.mp4"),
            Err(DownloadError::InvalidArgs(_))
        ));
        assert!(matches!(
            output_file("/does/not/exist/twitch-downloader", "video.mp4"),
            Err(DownloadError::InvalidArgs(_))
        ));
    }

    #[test]
    fn output_file_rejects_names_with_folders() {
        let folder = temp_folder();
        for name in ["", "  ", "..", "../video.mp4", "sub/video.mp4"] {
            assert!(
                matches!(
                    output_file(&folder, name),
                    Err(DownloadError::InvalidArgs(_))
                ),
                "accepted {:?}",
                name
            );
        }
    }

    #[test]
    fn active_download_allows_one_at_a_time() {
        let active = ActiveDownload::default();
        let token = active.start().unwrap();

        assert!(matches!(active.start(), Err(DownloadError::AlreadyRunning)));
        assert!(active.cancel());
        assert!(token.is_cancelled());

        active.finish();
        assert!(active.start().is_ok());
    }

    #[test]
    fn cancel_without_download_returns_false() {
        assert!(!ActiveDownload::default().cancel());
    }

    async fn written_file(name: &str) -> (PathBuf, BufWriter<File>) {
        let path =
            std::env::temp_dir().join(format!("twitch-downloader-{}-{}", std::process::id(), name));
        let mut output = create_output(&path).await.unwrap();
        output.write_all(b"data").await.unwrap();
        (path, output)
    }

    #[tokio::test]
    async fn close_output_keeps_file_on_success() {
        let (path, output) = written_file("success").await;
        close_output(output, &path, Ok(()), false).await.unwrap();

        assert_eq!(std::fs::read(&path).unwrap(), b"data");
        std::fs::remove_file(&path).unwrap();
    }

    #[tokio::test]
    async fn close_output_removes_failed_download() {
        let (path, output) = written_file("failed").await;
        let result = close_output(output, &path, Err(DownloadError::Cancelled), false).await;

        assert!(matches!(result, Err(DownloadError::Cancelled)));
        assert!(!path.exists());
    }

    #[tokio::test]
    async fn close_output_keeps_partial_live_recording() {
        let (path, output) = written_file("live").await;
        let result = close_output(output, &path, Err(DownloadError::EmptyPlaylist), true).await;

        assert!(result.is_err());
        assert_eq!(std::fs::read(&path).unwrap(), b"data");
        std::fs::remove_file(&path).unwrap();
    }

    #[tokio::test]
    async fn close_output_removes_empty_live_recording() {
        let path = std::env::temp_dir().join(format!(
            "twitch-downloader-{}-empty-live",
            std::process::id()
        ));
        let output = create_output(&path).await.unwrap();
        let result = close_output(output, &path, Err(DownloadError::EmptyPlaylist), true).await;

        assert!(result.is_err());
        assert!(!path.exists());
    }

    #[tokio::test]
    async fn close_output_removes_empty_successful_download() {
        let path = std::env::temp_dir().join(format!(
            "twitch-downloader-{}-empty-success",
            std::process::id()
        ));
        let output = create_output(&path).await.unwrap();
        let result = close_output(output, &path, Ok(()), true).await;

        assert!(matches!(result, Err(DownloadError::NothingDownloaded)));
        assert!(!path.exists());
    }

    #[tokio::test]
    async fn until_cancelled_stops_pending_work() {
        let token = CancellationToken::new();
        token.cancel();
        let result =
            until_cancelled(&token, std::future::pending::<Result<(), DownloadError>>()).await;

        assert!(matches!(result, Err(DownloadError::Cancelled)));
    }

    #[test]
    fn muted_fallback_rewrites_unmuted_segments() {
        let url = Url::parse("https://cdn.example.com/abc/chunked/12-unmuted.ts?x=1").unwrap();
        assert_eq!(
            muted_fallback(&url).unwrap().as_str(),
            "https://cdn.example.com/abc/chunked/12-muted.ts?x=1"
        );
        assert_eq!(
            muted_fallback(&Url::parse("https://cdn.example.com/12.ts").unwrap()),
            None
        );
    }

    #[test]
    fn only_not_found_and_gone_end_a_stream() {
        assert!(is_stream_gone(StatusCode::NOT_FOUND));
        assert!(is_stream_gone(StatusCode::GONE));
        assert!(!is_stream_gone(StatusCode::TOO_MANY_REQUESTS));
        assert!(!is_stream_gone(StatusCode::FORBIDDEN));
        assert!(!is_stream_gone(StatusCode::UNAUTHORIZED));
    }

    #[test]
    fn detects_restarted_media_sequence() {
        let playlist = |first: u64, count: u64| MediaPlaylist {
            segments: (first..first + count)
                .map(|sequence| crate::playlist::Segment {
                    sequence,
                    url: Url::parse(&format!("https://edge.example.net/{}", sequence)).unwrap(),
                })
                .collect(),
            ..MediaPlaylist::default()
        };

        assert!(!sequence_restarted(None, &playlist(0, 15)));
        assert!(!sequence_restarted(Some(2400), &MediaPlaylist::default()));
        // Nothing new yet, or a slightly stale window, is normal.
        assert!(!sequence_restarted(Some(2400), &playlist(2385, 15)));
        assert!(!sequence_restarted(Some(2400), &playlist(2380, 15)));
        assert!(sequence_restarted(Some(2400), &playlist(0, 15)));
    }

    #[test]
    fn retries_only_transient_http_errors() {
        assert!(DownloadError::Http(StatusCode::BAD_GATEWAY).is_retryable());
        assert!(DownloadError::Http(StatusCode::TOO_MANY_REQUESTS).is_retryable());
        assert!(!DownloadError::Http(StatusCode::FORBIDDEN).is_retryable());
        assert!(!DownloadError::Http(StatusCode::NOT_FOUND).is_retryable());
        assert!(!DownloadError::Cancelled.is_retryable());
    }
}
