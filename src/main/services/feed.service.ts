import Playlist from '../interfaces/Playlist'
import Feed from '../interfaces/Feed'
const m3u8Parser = require('m3u8-parser')

// https://www.twitch.tv/videos/1629671834?filter=archives&sort=time
// Passed a manifest string, returns an array of feeds
const getFeedList = (manifest: string): Feed => {
  const parser = new m3u8Parser.Parser()
  parser.addParser({
    expression: /^#VOD-FRAMERATE/,
    customType: 'framerate'
  })

  parser.push(manifest)
  parser.end()

  const playlists = parser.manifest.playlists

  return playlists.map((playlist): Playlist => {
    return {
      video: playlist.attributes.VIDEO,
      quality: playlist.attributes.RESOLUTION,
      url: playlist.uri,
      framerate: playlist.attributes['FRAME-RATE'],
      bandwidth: playlist.attributes.BANDWIDTH,
      codecs: playlist.attributes.CODECS
    }
  })
}

export {
  getFeedList
}
