import { getAuth, parseUrl } from '../services/twitch.service'
import Credentials from '../interfaces/Credential'
import axios from 'axios'
import { getFeedList } from '../services/feed.service'
import Playlist from '../interfaces/Playlist'
import FeedOption from '../interfaces/FeedOption'
import Feed from '../interfaces/Feed'

const getFeeds = async (url: string): Promise<Feed> => {
  const id: string = parseUrl(url)

  const credentials: Credentials = await getAuth(id, true)

  const response = await axios.get(`https://usher.ttvnw.net/vod/${id}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)

  return getFeedList(response.data)
}

const getFeedOptions = (feeds): FeedOption => {
  return feeds.map((feed: Playlist, index: number) => {
    return {
      title: feed.video === 'chunked' ? 'Original' : feed.video,
      value: index
    }
  })
}

export {
  getFeeds,
  getFeedOptions
}
