import { getAuth, parseUrl } from '../services/twitch.service'
import Credentials from '../interfaces/Credential'
import axios from 'axios'
import { getFeedList } from '../services/feed.service'

const getFeeds = async (url: string): Promise<object[]> => {
  const id: string = parseUrl(url)

  const credentials: Credentials = await getAuth(id, true)

  const response = await axios.get(`https://usher.ttvnw.net/vod/${id}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)

  return getFeedList(response.data)
}

export {
  getFeeds
}
