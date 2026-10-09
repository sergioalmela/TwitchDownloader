import { fetch } from '@tauri-apps/plugin-http'
import { ContentTypes } from '../detectContentType.ts'
import type { ContentId } from '../getContentId.ts'
import { getAuthHeaders } from './getAuthHeaders.ts'
import { getAuthVariables } from './getAuthVariables.ts'

export type Credentials = {
  signature: string
  value: string
}

type AuthResponse = {
  data: {
    videoPlaybackAccessToken?: Credentials | null
    clip?: {
      playbackAccessToken: Credentials | null
    } | null
    streamPlaybackAccessToken?: Credentials | null
  }
}

export const getCredentials = async (
  contentType: ContentTypes,
  id: ContentId,
): Promise<Credentials> => {
  const response = await fetch('https://gql.twitch.tv/gql', {
    method: 'POST',
    body: JSON.stringify(getAuthVariables(contentType, id)),
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Twitch returned HTTP ${response.status}`)
  }

  const responseData: AuthResponse = await response.json()
  const credentials = getAccessTokenFromResponse(contentType, responseData)

  if (!credentials) {
    throw new Error('Content not found')
  }

  return credentials
}

const getAccessTokenFromResponse = (
  contentType: ContentTypes,
  response: AuthResponse,
): Credentials | null | undefined => {
  if (contentType === ContentTypes.VOD) {
    return response.data?.videoPlaybackAccessToken
  }
  if (contentType === ContentTypes.CLIP) {
    return response.data?.clip?.playbackAccessToken
  }
  return response.data?.streamPlaybackAccessToken
}
