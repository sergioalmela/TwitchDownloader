import Playlist from '../../interfaces/Playlist'

const m3u8Parser = require('m3u8-parser')

// Passed a manifest string, returns an array of feeds
const getFeedList = (manifest: string): object[] => {
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
