use std::fmt;

use url::Url;

#[derive(Debug, Default, PartialEq)]
pub struct MediaPlaylist {
    pub init_url: Option<Url>,
    pub segments: Vec<Segment>,
    pub ended: bool,
}

#[derive(Debug, PartialEq)]
pub struct Segment {
    pub sequence: u64,
    pub url: Url,
}

#[derive(Debug, PartialEq)]
pub enum PlaylistError {
    InvalidMediaSequence,
    InvalidUrl,
}

impl fmt::Display for PlaylistError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            PlaylistError::InvalidMediaSequence => write!(f, "invalid media sequence"),
            PlaylistError::InvalidUrl => write!(f, "invalid segment URL"),
        }
    }
}

/// Parses an HLS media playlist. Segments are read from the URI after each `#EXTINF`
/// tag, not by file extension, because Twitch serves both MPEG-TS and fragmented MP4.
pub fn parse_media_playlist(
    body: &str,
    playlist_url: &Url,
) -> Result<MediaPlaylist, PlaylistError> {
    let mut playlist = MediaPlaylist::default();
    let mut sequence = 0;
    let mut expecting_segment = false;

    for line in body.lines().map(str::trim).filter(|line| !line.is_empty()) {
        if let Some(value) = line.strip_prefix("#EXT-X-MEDIA-SEQUENCE:") {
            sequence = value
                .trim()
                .parse()
                .map_err(|_| PlaylistError::InvalidMediaSequence)?;
        } else if let Some(attributes) = line.strip_prefix("#EXT-X-MAP:") {
            if let Some(uri) = quoted_attribute(attributes, "URI") {
                playlist.init_url = Some(resolve(playlist_url, uri)?);
            }
        } else if line == "#EXT-X-ENDLIST" {
            playlist.ended = true;
        } else if line.starts_with("#EXTINF:") {
            expecting_segment = true;
        } else if !line.starts_with('#') && expecting_segment {
            playlist.segments.push(Segment {
                sequence,
                url: resolve(playlist_url, line)?,
            });
            sequence += 1;
            expecting_segment = false;
        }
    }

    Ok(playlist)
}

fn resolve(playlist_url: &Url, uri: &str) -> Result<Url, PlaylistError> {
    playlist_url
        .join(uri)
        .map_err(|_| PlaylistError::InvalidUrl)
}

fn quoted_attribute<'a>(attributes: &'a str, name: &str) -> Option<&'a str> {
    let mut rest = attributes;
    loop {
        let (key, after) = rest.split_once('=')?;
        let key = key.trim_start_matches(',').trim();
        let (value, tail) = match after.strip_prefix('"') {
            Some(quoted) => quoted.split_once('"')?,
            None => after.split_once(',').unwrap_or((after, "")),
        };
        if key == name {
            return Some(value);
        }
        rest = tail;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn url(value: &str) -> Url {
        Url::parse(value).unwrap()
    }

    #[test]
    fn parses_fmp4_vod_with_relative_uris() {
        let body = "#EXTM3U\n#EXT-X-VERSION:6\n#EXT-X-PLAYLIST-TYPE:EVENT\n#EXT-X-MEDIA-SEQUENCE:0\n\
                    #EXT-X-MAP:URI=\"init-0.mp4\"\n#EXT-X-PROGRAM-DATE-TIME:2026-10-09T07:59:53.838Z\n\
                    #EXTINF:10.000,\n0.mp4\n#EXTINF:10.000,\n1.mp4\n#EXT-X-ENDLIST\n";
        let playlist = parse_media_playlist(
            body,
            &url("https://cdn.example.com/abc/chunked/index-dvr.m3u8"),
        )
        .unwrap();

        assert_eq!(
            playlist.init_url,
            Some(url("https://cdn.example.com/abc/chunked/init-0.mp4"))
        );
        assert_eq!(
            playlist.segments,
            vec![
                Segment {
                    sequence: 0,
                    url: url("https://cdn.example.com/abc/chunked/0.mp4")
                },
                Segment {
                    sequence: 1,
                    url: url("https://cdn.example.com/abc/chunked/1.mp4")
                },
            ]
        );
        assert!(playlist.ended);
    }

    #[test]
    fn parses_ts_vod_including_muted_segments() {
        let body = "#EXTM3U\n#EXTINF:10.000,\n0.ts\n#EXTINF:10.000,\n1-muted.ts\n#EXT-X-ENDLIST";
        let playlist =
            parse_media_playlist(body, &url("https://cdn.example.com/720p60/index-dvr.m3u8"))
                .unwrap();

        assert_eq!(playlist.init_url, None);
        assert_eq!(playlist.segments.len(), 2);
        assert_eq!(
            playlist.segments[1].url,
            url("https://cdn.example.com/720p60/1-muted.ts")
        );
    }

    #[test]
    fn parses_live_playlist_with_sequence_and_extensionless_urls() {
        let body = "#EXTM3U\n#EXT-X-MEDIA-SEQUENCE:2355\n\
                    #EXT-X-DATERANGE:ID=\"source-1\",CLASS=\"twitch-stream-source\",START-DATE=\"2026-10-09T09:18:23.838Z\"\n\
                    #EXT-X-MAP:URI=\"https://edge.example.net/v1/segment/init\"\n\
                    #EXTINF:2.000,live\nhttps://edge.example.net/v1/segment/AAA\n\
                    #EXTINF:2.000,live\nhttps://edge.example.net/v1/segment/BBB\n\
                    #EXT-X-TWITCH-PREFETCH:https://edge.example.net/v1/segment/CCC.ts\n";
        let playlist =
            parse_media_playlist(body, &url("https://playlist.example.net/v1/live.m3u8")).unwrap();

        assert_eq!(
            playlist.init_url,
            Some(url("https://edge.example.net/v1/segment/init"))
        );
        assert_eq!(
            playlist.segments,
            vec![
                Segment {
                    sequence: 2355,
                    url: url("https://edge.example.net/v1/segment/AAA")
                },
                Segment {
                    sequence: 2356,
                    url: url("https://edge.example.net/v1/segment/BBB")
                },
            ]
        );
        assert!(!playlist.ended);
    }

    #[test]
    fn ignores_uris_without_extinf() {
        let body = "#EXTM3U\nstray.ts\n#EXTINF:2.000,\nreal.ts\n";
        let playlist = parse_media_playlist(body, &url("https://a.example/p.m3u8")).unwrap();

        assert_eq!(playlist.segments.len(), 1);
        assert_eq!(playlist.segments[0].url, url("https://a.example/real.ts"));
    }

    #[test]
    fn empty_body_has_no_segments() {
        let playlist = parse_media_playlist("", &url("https://a.example/p.m3u8")).unwrap();
        assert_eq!(playlist, MediaPlaylist::default());
    }

    #[test]
    fn rejects_malformed_media_sequence() {
        let result = parse_media_playlist(
            "#EXT-X-MEDIA-SEQUENCE:abc\n",
            &url("https://a.example/p.m3u8"),
        );
        assert_eq!(result, Err(PlaylistError::InvalidMediaSequence));
    }

    #[test]
    fn rejects_unresolvable_segment_url() {
        let result = parse_media_playlist(
            "#EXTINF:2.000,\nhttp://[::1\n",
            &url("https://a.example/p.m3u8"),
        );
        assert_eq!(result, Err(PlaylistError::InvalidUrl));
    }

    #[test]
    fn reads_quoted_attribute_among_others() {
        assert_eq!(
            quoted_attribute("BYTERANGE=\"720@0\",URI=\"init.mp4\"", "URI"),
            Some("init.mp4")
        );
        assert_eq!(
            quoted_attribute("METHOD=NONE,URI=\"a,b.mp4\"", "URI"),
            Some("a,b.mp4")
        );
        assert_eq!(quoted_attribute("BYTERANGE=\"720@0\"", "URI"), None);
    }
}
