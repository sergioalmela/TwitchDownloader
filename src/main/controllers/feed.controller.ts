import { getAuth, isContentRestricted, parseUrl } from '../services/twitch.service'
import Credentials from '../interfaces/Credential'
import axios from 'axios'
import { getFeedList } from '../services/feed.service'
import Playlist from '../interfaces/Playlist'
import FeedOption from '../interfaces/FeedOption'
import Feed from '../interfaces/Feed'

const getFeeds = async (url: string): Promise<Feed> => {
  const id: string = parseUrl(url)

  const credentials: Credentials = await getAuth(id, true)

  let response
  let responseData = null
  try {
    response = await axios.get(`https://usher.ttvnw.net/vod/${id}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)
    responseData = response.data
    console.log(responseData)
  } catch (error) {
    if (isContentRestricted(error.response.data)) {
      const config: any = {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: '"application/vnd.twitchtv.v5+json',
          'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
        }
      }

      const responseFromRestricted = await axios.get(`https://api.twitch.tv/kraken/videos/${id}`, config)

      const baseUrlRaw = responseFromRestricted.data.seek_previews_url
      // Get content from baseUrlRaw until second slash (excluding https://)
      const baseUrl = baseUrlRaw.split('/').slice(0, 4).join('/')

      const urlType = responseFromRestricted.data.broadcast_type === 'highlight' ? `highlight-${id}` : 'index-dvr'

      // Add manually the restricted feed options
      const resolutions = responseFromRestricted.data.resolutions
      const framerates = responseFromRestricted.data.fps

      responseData = '#EXTM3U\n #EXT-X-TWITCH-INFO:ORIGIN="s3",B="false",REGION="EU",USER-IP="185.74.243.1",SERVING-ID="92a7f29d6bfa456aa651b98dd9ae7764",CLUSTER="cloudfront_vod",USER-COUNTRY="ES",MANIFEST-CLUSTER="cloudfront_vod"\n'
      for (const alias in resolutions) {
        const resolution = resolutions[alias]
        const framerate = framerates[alias]
        responseData += `#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="${alias}",NAME="${resolution}",AUTOSELECT=NO,DEFAULT=NO\n #EXT-X-STREAM-INF:BANDWIDTH=8770285,CODECS="avc1.4D402A,mp4a.40.2",RESOLUTION=${resolution},VIDEO="${alias}",FRAME-RATE=${framerate}\n ${baseUrl}/chunked/${urlType}.m3u8\n`
      }
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

export {
  getFeeds,
  getFeedOptions
}
