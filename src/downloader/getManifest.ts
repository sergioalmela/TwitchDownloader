import { ContentTypes } from './detectContentType.ts'
import { ContentId } from './getContentId.ts'
import { Credentials } from './auth/getCredentials.ts'
import { fetch } from '@tauri-apps/plugin-http'
import { getAuthHeaders } from './auth/getAuthHeaders.ts'
import { getAuthVariables } from './auth/getAuthVariables.ts'

type VideoQuality = {
  sourceURL: string
  frameRate: number
  quality: string
  mimeType: string
  width: number
  height: number
  bitrate: number
  isSource: boolean
  isAudioOnly: boolean
}

type ApiClipResponse = {
  data: {
    clip: {
      videoQualities: VideoQuality[]
    }
  }
}

export const getManifest = async (
  contentType: ContentTypes,
  id: ContentId,
  credentials: Credentials
) => {
  if (contentType === ContentTypes.LIVE)
    return getManifestFromLive(id, credentials)
  if (contentType === ContentTypes.VOD)
    return getManifestFromVod(id, credentials)
  if (contentType === ContentTypes.CLIP)
    return getManifestFromClip(id, credentials)
  return null
}

const getManifestFromLive = async (
  id: ContentId,
  credentials: Credentials
): Promise<string | null> => {
  const response = await fetch(
    `https://usher.ttvnw.net/api/channel/hls/${id}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`,
    {
      method: 'GET'
    }
  )

  if (!response.ok) {
    console.error('Failed to fetch manifest:', response.statusText)
    return null
  }

  return await response.text()
}

const getManifestFromVod = async (
  id: ContentId,
  credentials: Credentials
): Promise<string | null> => {
  const response = await fetch(
    `https://usher.ttvnw.net/vod/${id}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`,
    {
      method: 'GET'
    }
  )

  if (!response.ok) {
    console.error('Failed to fetch manifest:', response.statusText)
    return null
  }

  return await response.text()
}

const getManifestFromClip = async (
  id: ContentId,
  credentials: Credentials
): Promise<string | null> => {
  const response = await fetch('https://gql.twitch.tv/gql', {
    method: 'POST',
    body: JSON.stringify(getAuthVariables(ContentTypes.CLIP, id)),
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    console.error('Failed to fetch manifest:', response.statusText)
    return null
  }

  const data = (await response.json()) as ApiClipResponse
  const qualities = data.data.clip.videoQualities

  qualities.forEach((quality: VideoQuality) => {
    if (!quality.quality.endsWith('p')) {
      quality.quality += 'p'
    }
  })

  return completeManifest(qualities, credentials)
}

const manifestHeaders = (): string => {
  return '#EXTM3U\n #EXT-X-TWITCH-INFO:ORIGIN="s3",B="false",REGION="EU",USER-IP="",SERVING-ID="ccd9bc3e453d48fb83584725c6703ed8",CLUSTER="cloudfront_vod",USER-COUNTRY="",MANIFEST-CLUSTER="cloudfront_vod"\n'
}

const manifestContent = (
  qualities: VideoQuality[],
  credentials: Credentials
): string => {
  let content = ''
  qualities.forEach((quality: VideoQuality) => {
    content +=
      `#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="${quality.quality}",NAME="${quality.quality}",AUTOSELECT=NO,DEFAULT=NO\n` +
      `#EXT-X-STREAM-INF:BANDWIDTH=0,CODECS="${DEFAULT_VIDEO_CODEC}",RESOLUTION=${quality.quality},VIDEO="${quality.quality}",FRAME-RATE=${quality.frameRate} \n` +
      `${quality.sourceURL}?sig=${
        credentials.signature
      }&token=${encodeURIComponent(credentials.value)} \n`
  })

  return content
}

const completeManifest = (
  qualities: VideoQuality[],
  credentials: Credentials
): string => {
  return manifestHeaders() + manifestContent(qualities, credentials)
}

const DEFAULT_VIDEO_CODEC = 'avc1.4D402A,mp4a.40.2'
