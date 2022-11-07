import Credentials from '../interfaces/Credential'
import axios from 'axios'

const getAuth = async (id: string, isVod: Boolean): Promise<Credentials> => {
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

const parseUrl = (url: string): string => {
  const regex = /(?<=videos\/)(\d+)/g
  const id = url.match(regex)
  return id[0].toString()
}

export {
  getAuth,
  parseUrl
}
