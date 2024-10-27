use std::collections::HashSet;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use std::sync::{Arc, Mutex};
use tauri::WebviewWindow;
use tauri::Emitter;

#[derive(Debug)]
enum DownloadError {
    Request,
    Io,
}

impl From<reqwest::Error> for DownloadError {
    fn from(_err: reqwest::Error) -> Self {
        DownloadError::Request
    }
}

impl From<std::io::Error> for DownloadError {
    fn from(_err: std::io::Error) -> Self {
        DownloadError::Io
    }
}

#[derive(serde::Deserialize)]
pub struct DownloadArgs {
    m3u8_url: String,
    download_path: String,
    file_name: String,
}

#[tauri::command]
pub async fn download_live(args: DownloadArgs, window: WebviewWindow) -> Result<(), String> {
    let output_file = Path::new(&args.download_path).join(args.file_name);

    let window_arc = Arc::new(Mutex::new(window));

    match download_parse_m3u8_live(
        window_arc,
        &args.m3u8_url,
        &args.download_path,
        &output_file,
    )
    .await
    {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Download failed: {:?}", e)),
    }
}

#[tauri::command]
pub async fn download_vod(args: DownloadArgs, window: WebviewWindow) -> Result<(), String> {
    let output_file = Path::new(&args.download_path).join(args.file_name);

    match download_parse_m3u8_vod(window, &args.m3u8_url, &args.download_path, &output_file).await {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Download failed: {:?}", e)),
    }
}

#[tauri::command]
pub async fn download_clip(args: DownloadArgs, window: WebviewWindow) -> Result<(), String> {
    let output_file = Path::new(&args.download_path).join(args.file_name);

    match download_parse_m3u8_clip(window, &args.m3u8_url, &args.download_path, &output_file).await
    {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Download failed: {:?}", e)),
    }
}

async fn download_parse_m3u8_live(
    window_arc: Arc<Mutex<WebviewWindow>>,
    url: &str,
    _download_path: &str,
    output_file: &Path,
) -> Result<(), DownloadError> {
    let mut downloaded_segments = HashSet::new();
    let mut output = File::create(output_file)?;
    let mut is_stream_over = false;

    loop {
        let response = reqwest::get(url).await?.text().await?;

        // Set Stream is over
        if response.contains("#EXT-X-ENDLIST") {
            is_stream_over = true;
        }

        let segment_lines: Vec<&str> = response
            .lines()
            .filter(|line| line.contains(".ts"))
            .map(|line| line.split('?').next().unwrap_or(line))
            .collect();

        if segment_lines.is_empty() {
            if is_stream_over {
                // If there are no segments and the stream is over, break the loop
                break;
            } else {
                // If there are no segments but the stream is not over yet, wait and then continue
                tokio::time::sleep(std::time::Duration::from_secs(5)).await;
                continue;
            }
        }

        for line in &segment_lines {
            let line_str = line.to_string();
            if downloaded_segments.contains(&line_str) {
                continue;
            }

            let segment_url = if line.starts_with("http") {
                line.to_string()
            } else {
                format!("{}/{}", url, line)
            };

            let content = reqwest::get(&segment_url).await?.bytes().await?;
            output.write_all(&content)?;

            downloaded_segments.insert(line_str);
        }

        let progress = if is_stream_over { 100.0 } else { 50.0 };

        {
            let window = window_arc.lock().unwrap();
            window
                .emit("download-progress", &progress)
                .expect("Failed to emit progress event");
        }

        if is_stream_over {
            break;
        }

        tokio::time::sleep(std::time::Duration::from_secs(5)).await;
    }

    Ok(())
}

async fn download_parse_m3u8_vod(
    window: WebviewWindow,
    url: &str,
    _download_path: &str,
    output_file: &Path,
) -> Result<(), DownloadError> {
    let response = reqwest::get(url).await?.text().await?;
    let base_url = url.rsplit_once('/').map(|x| x.0).unwrap_or("");
    let mut output = File::create(output_file)?;
    let segment_lines: Vec<&str> = response
        .lines()
        .filter(|line| line.ends_with(".ts"))
        .collect();
    let total_segments = segment_lines.len();

    for (index, line) in segment_lines.iter().enumerate() {
        let segment_url = if line.starts_with("http") {
            line.to_string()
        } else {
            format!("{}/{}", base_url, line)
        };
        let content = reqwest::get(&segment_url).await?.bytes().await?;
        output.write_all(&content)?;

        // Emit progress event
        let progress = (index + 1) as f64 / total_segments as f64 * 100.0;
        window
            .emit("download-progress", &progress)
            .expect("Failed to emit progress event");
    }

    Ok(())
}

async fn download_parse_m3u8_clip(
    window: WebviewWindow,
    url: &str,
    _download_path: &str,
    output_file: &Path,
) -> Result<(), DownloadError> {
    // Directly download the content from the URL (assuming it's an MP4 file)
    let content = reqwest::get(url).await?.bytes().await?;

    // Create the output file and write the content to it
    let mut output = File::create(output_file)?;
    output.write_all(&content)?;

    // Emit a success event (100% progress)
    window
        .emit("download-progress", &100.0)
        .expect("Failed to emit progress event");

    Ok(())
}
