import Credentials from "../../interfaces/Credential"
import { getFeedList } from "./feed.controller"

const axios = require('axios')

class VodController {
  async getFeeds (id: string, credentials: Credentials): Promise<Array<object>> {
    const response = await axios.get(`https://usher.ttvnw.net/vod/${id}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)

    return getFeedList(response.data)
  }

  getVod (): string {
    return 'GOT Vod!'
  }

  async getAuth (id: string, isVod: Boolean): Promise<Credentials> {
    const json: object = {
      operationName: 'PlaybackAccessToken',
      variables: {
        isLive: !isVod,
        login: '',
        isVod: isVod,
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
      // TODO: Return error
    }
  }
}

module.exports = VodController
