import { getAuth, getFeedFromId, getRestrictedFeed, isContentRestricted, parseUrl } from '../services/twitch.service'
import Credentials from '../interfaces/Credential'
import Playlist from '../interfaces/Playlist'
import FeedOption from '../interfaces/FeedOption'
import Feed from '../interfaces/Feed'

const m3u8Parser = require('m3u8-parser')

const getFeeds = async (url: string): Promise<Feed> => {
  const id: string = parseUrl(url)

  const credentials: Credentials = await getAuth(id, true)

  let response
  let responseData = null
  try {
    response = await getFeedFromId(id, credentials)
    responseData = response.data
  } catch (error) {
    if (isContentRestricted(error.response.data)) {
      responseData = await getRestrictedFeed(id)
    }
  }

  return getFeedList(responseData)
}

const getFeedOptions = (feeds): FeedOption => {
  return feeds.map((feed: Playlist, index: number) => {
    return {
      title: feed.video === 'chunked' ? 'Original' : feed.video,
      value: index
    }
  })
}

// Passed a manifest string, returns an array of feeds
const getFeedList = (manifest: string): Feed => {
  const playlists = getPlaylists(manifest)

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

const getPlaylists = (manifest: string) => {
  const parser = new m3u8Parser.Parser()
  parser.addParser({
    expression: /^#VOD-FRAMERATE/,
    customType: 'framerate'
  })

  parser.push(manifest)
  parser.end()

  return parser.manifest.playlists
}

export {
  getFeeds,
  getFeedOptions
}
