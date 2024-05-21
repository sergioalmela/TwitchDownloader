import { Body, fetch } from '@tauri-apps/api/http'
import { getAuthHeaders } from './getAuthHeaders.ts'
import { ContentId } from '../getContentId.ts'
import { getAuthVariables } from './getAuthVariables.ts'
import { ContentTypes } from '../detectContentType.ts'

export type Credentials = {
  signature: string
  value: string
}

type AuthResponse = {
  data: {
    data: {
      videoPlaybackAccessToken: Credentials
      clip: {
        playbackAccessToken: Credentials
      }
      streamPlaybackAccessToken: Credentials
    }
  }
}

export const getCredentials = async (
  contentType: ContentTypes,
  id: ContentId
): Promise<Credentials> => {
  const response: AuthResponse = await fetch('https://gql.twitch.tv/gql', {
    method: 'POST',
    timeout: 30,
    body: Body.json(getAuthVariables(contentType, id)),
    headers: getAuthHeaders()
  })

  console.log(response)

  return getAccessTokenFromResponse(contentType, response)
}

const getAccessTokenFromResponse = (
  contentType: ContentTypes,
  response: AuthResponse
): Credentials => {
  if (contentType === ContentTypes.VOD) {
    return response.data.data.videoPlaybackAccessToken
  } else if (contentType === ContentTypes.CLIP) {
    return response.data.data.clip.playbackAccessToken
  } else {
    return response.data.data.streamPlaybackAccessToken
  }
}
