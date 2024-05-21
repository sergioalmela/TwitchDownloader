import { ContentId } from '../getContentId.ts'
import { ContentTypes } from '../detectContentType.ts'

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

export const getAuthVariables = (
  contentType: ContentTypes,
  id: ContentId
): AuthVariables => {
  if (contentType === ContentTypes.LIVE) return getLiveVariables(id)
  if (contentType === ContentTypes.VOD) return getVodVariables(id)
  if (contentType === ContentTypes.CLIP) return getClipVariables(id)
  throw new Error('Unknown content type')
}

const getLiveVariables = (id: ContentId): AuthVariables => {
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
const getVodVariables = (id: ContentId): AuthVariables => {
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

const getClipVariables = (id: ContentId): AuthVariables => {
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
