import { IdVo } from '../valueObjects/id.vo'

const authConfigLive = (id: IdVo): object => {
  return {
    operationName: 'PlaybackAccessToken',
    variables: {
      isLive: true,
      login: id.value.toString(),
      isVod: false,
      vodID: '',
      playerType: 'embed'
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: '0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712'
      }
    }
  }
}

export {
  authConfigLive
}
