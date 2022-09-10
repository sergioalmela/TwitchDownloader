const axios = require('axios')

class VodController {
  getVod (): string {
    return 'GOT Vod!'
  }

  async getAuth (isVod): Promise<string> {
    const id : Number = 1579649789
    let json = null

    if (isVod) {
      json = '{"operationName": "PlaybackAccessToken","variables": {"isLive": false,"login": "","isVod": true,"vodID": "' + id + '","playerType": "channel_home_live"},"extensions": {"persistedQuery": {"version": 1,"sha256Hash": "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712"}}}'
    } else {
      json = '{"operationName": "PlaybackAccessToken","variables": {"isLive": true,"login": "' + id + '","isVod": false,"vodID": "","playerType": "channel_home_live"},"extensions": {"persistedQuery": {"version": 1,"sha256Hash": "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712"}}}'
    }

    const parsed = JSON.parse(json)

    const config = {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
      }
    }
    const response = await axios.post('https://gql.twitch.tv/gql', parsed, config)

    if (response.status === 200 && (typeof response.data === 'object')) {
      return response.data
    } else {
      // TODO: Return error
    }
  }
}

module.exports = VodController
