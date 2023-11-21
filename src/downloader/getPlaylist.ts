// @ts-ignore
import { Parser } from 'm3u8-parser'

export type Playlist = {
  video: string
  quality: string
  url: string
  framerate: string
  bandwidth: string
  codecs: string
}

type RawPlaylist = {
  attributes: {
    BANDWIDTH: string
    CODECS: string
    'FRAME-RATE': string
    RESOLUTION: string
    VIDEO: string
  }
  uri: string
}

export const getPlaylist = (manifest: string): Playlist[] => {
  const parsedPlaylist = parsePlaylist(manifest)

  if (parsedPlaylist.length === 0) {
    throw new Error('Playlist not found')
  }

  return parsedPlaylist.map((playlist) => {
    return {
      video:
        playlist.attributes.VIDEO === 'chunked'
          ? 'Original'
          : playlist.attributes.VIDEO,
      quality: playlist.attributes.RESOLUTION,
      url: playlist.uri,
      framerate: playlist.attributes['FRAME-RATE'],
      bandwidth: playlist.attributes.BANDWIDTH,
      codecs: playlist.attributes.CODECS
    }
  })
}

const parsePlaylist = (manifest: string): RawPlaylist[] => {
  const parser = new Parser()

  parser.push(manifest)
  parser.end()

  return parser.manifest.playlists
}
