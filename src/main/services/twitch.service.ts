import Credentials from '../interfaces/Credentials'
import axios from 'axios'
import {InvalidUrlException} from '../infrastructure/errors/invalidUrl.exception'

const getAuth = async (id: string, isVod: Boolean): Promise<Credentials> => {
  const json: object = {
    operationName: 'PlaybackAccessToken',
    variables: {
      isLive: !isVod,
      login: '',
      isVod,
      vodID: isVod ? id.toString() : '',
      playerType: 'site'
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: '0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712'
      }
    }
  }

  const config: object = {
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
    }
  }

  const { data, status } = await axios.post('https://gql.twitch.tv/gql', json, config)

  if (status === 200 && (typeof data === 'object')) {
    return data.data.videoPlaybackAccessToken
  } else {
    throw new Error('Error getting auth')
    // TODO: Return error
  }
}

const getFeedFromId = async (id: string, credentials: Credentials): Promise<any> => {
  return await axios.get(`https://usher.ttvnw.net/vod/${id}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)
}

const getRestrictedData = async (id: string): Promise<any> => {
  const config: any = {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: '"application/vnd.twitchtv.v5+json',
      'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
    }
  }

  return await axios.get(`https://api.twitch.tv/kraken/videos/${id}`, config)
}

const getRestrictedFeed = async (id: string): Promise<any> => {
  const responseFromRestricted = await getRestrictedData(id)

  const baseUrlRaw: string = responseFromRestricted.data.seek_previews_url
  // Get content from baseUrlRaw until second slash (excluding https://)
  const baseUrl: string = baseUrlRaw.split('/').slice(0, 4).join('/')

  const urlType: string = responseFromRestricted.data.broadcast_type === 'highlight' ? `highlight-${id}` : 'index-dvr'

  // Add manually the restricted feed options
  const resolutions = responseFromRestricted.data.resolutions
  const framerates = responseFromRestricted.data.fps

  let response: string = ''
  for (const alias in resolutions) {
    const resolution = resolutions[alias]
    const framerate = framerates[alias]
    response += `#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="${alias}",NAME="${resolution}",AUTOSELECT=NO,DEFAULT=NO\n #EXT-X-STREAM-INF:BANDWIDTH=8770285,CODECS="avc1.4D402A,mp4a.40.2",RESOLUTION=${resolution},VIDEO="${alias}",FRAME-RATE=${framerate}\n ${baseUrl}/chunked/${urlType}.m3u8\n`
  }

  return response
}

const isContentRestricted = (data: any[] | string): boolean => {
  if (Array.isArray(data)) {
    const error_code = data[0].error_code
    return error_code.includes('restricted')
  }

  return false
}

const getIdFromUrl = (url: string): string => {
  const regex = /(?<=videos\/)(\d+)/g
  const id = url.match(regex)

  // If id[0] exists, return it, else return null
  if (id == null) {
    throw new InvalidUrlException()
  }

  return id[0]
}

export {
  getAuth,
  getIdFromUrl,
  getFeedFromId,
  getRestrictedFeed,
  isContentRestricted
}
