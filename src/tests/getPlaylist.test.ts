import { describe, expect, it } from 'vitest'
import { getPlaylist } from '../downloader/getPlaylist.ts'

const VALID_MANIFEST = `#EXTM3U
#EXT-X-TWITCH-INFO:ORIGIN="s3",B="false",REGION="EU"
#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="chunked",NAME="1080p60",AUTOSELECT=YES,DEFAULT=YES
#EXT-X-STREAM-INF:BANDWIDTH=6000000,CODECS="avc1.4D402A,mp4a.40.2",RESOLUTION=1920x1080,VIDEO="chunked",FRAME-RATE=60.000
https://video-weaver.example.com/chunked/index-dvr.m3u8
#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="720p60",NAME="720p60",AUTOSELECT=YES,DEFAULT=YES
#EXT-X-STREAM-INF:BANDWIDTH=3000000,CODECS="avc1.4D401F,mp4a.40.2",RESOLUTION=1280x720,VIDEO="720p60",FRAME-RATE=60.000
https://video-weaver.example.com/720p60/index-dvr.m3u8`

describe('getPlaylist', () => {
  it('should parse a valid manifest into playlists', () => {
    const playlists = getPlaylist(VALID_MANIFEST)
    expect(playlists).toHaveLength(2)
  })

  it('should map chunked video name to Original', () => {
    const playlists = getPlaylist(VALID_MANIFEST)
    expect(playlists[0].video).toBe('Original')
  })

  it('should keep non-chunked video names as-is', () => {
    const playlists = getPlaylist(VALID_MANIFEST)
    expect(playlists[1].video).toBe('720p60')
  })

  it('should extract correct URL, resolution, and codecs', () => {
    const playlists = getPlaylist(VALID_MANIFEST)
    expect(playlists[0].url).toBe(
      'https://video-weaver.example.com/chunked/index-dvr.m3u8',
    )
    expect(playlists[0].quality).toEqual({ width: 1920, height: 1080 })
    expect(playlists[0].codecs).toBe('avc1.4D402A,mp4a.40.2')
    expect(playlists[0].bandwidth).toBe(6000000)
  })

  it('should throw on empty manifest', () => {
    expect(() => getPlaylist('')).toThrow('Content not found or not started')
  })

  it('should throw on manifest with no playlists', () => {
    expect(() => getPlaylist('#EXTM3U\n#EXT-X-VERSION:3')).toThrow(
      'Content not found or not started',
    )
  })
})
