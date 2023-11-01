import { Body, fetch } from '@tauri-apps/api/http'
import { getAuthHeaders } from './getAuthHeaders.ts'
import { ContentId } from '../getContentId.ts'
import { getVodVariables } from './getAuthVariables.ts'

export type Credentials = {
  signature: string
  value: string
}

type ApiResponse = {
  data: {
    data: {
      videoPlaybackAccessToken: Credentials
    }
  }
}

export const getCredentials = async (id: ContentId): Promise<Credentials> => {
  const data = (await fetch('https://gql.twitch.tv/gql', {
    method: 'POST',
    timeout: 30,
    body: Body.json(
      // TODO: Pass ContentType as parameter
      getVodVariables(id)
    ),
    headers: getAuthHeaders()
  })) as ApiResponse
  console.log(data)

  return data.data.data.videoPlaybackAccessToken
}
