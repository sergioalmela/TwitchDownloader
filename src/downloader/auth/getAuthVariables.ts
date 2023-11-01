import { ContentId } from '../getContentId.ts'

interface AuthVariables {
  operationName: string
  variables: {
    isLive?: boolean
    login?: string
    isVod?: boolean
    vodID?: string
    playerType?: string
    slug?: string
  }
  extensions?: {
    persistedQuery: {
      version: number
      sha256Hash: string
    }
  }
}

export const getLiveVariables = (id: ContentId): AuthVariables => {
  return {
    operationName: 'PlaybackAccessToken',
    variables: {
      isLive: true,
      login: id,
      isVod: false,
      vodID: '',
      playerType: 'embed'
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash:
          '0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712'
      }
    }
  }
}
export const getVodVariables = (id: ContentId): AuthVariables => {
  return {
    operationName: 'PlaybackAccessToken',
    variables: {
      isLive: false,
      login: '',
      isVod: true,
      vodID: id,
      playerType: 'site'
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash:
          '0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712'
      }
    }
  }
}

export const getClipVariables = (id: ContentId): AuthVariables => {
  return {
    operationName: 'VideoAccessToken_Clip',
    variables: {
      slug: id
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash:
          '36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11'
      }
    }
  }
}
