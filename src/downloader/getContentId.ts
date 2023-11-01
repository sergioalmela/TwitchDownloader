import { ContentTypes } from './detectContentType.ts'

export const getContentIdFromUrl = (
  contentType: ContentTypes,
  url: string
): string | null => {
  if (contentType === ContentTypes.LIVE) return getContentIdFromLive(url)
  if (contentType === ContentTypes.VOD) return getContentIdFromVod(url)
  if (contentType === ContentTypes.CLIP) return getContentIdFromClip(url)
  return null
}

export type ContentId = string

const getContentIdFromLive = (url: string): string | null => {
  const separatedUrl = url.split('/')

  if (separatedUrl.length === 0) return null

  return separatedUrl[separatedUrl.length - 1].split(/[?#]/)[0] || null
}

const getContentIdFromVod = (url: string): string | null => {
  const regex = /(?<=videos\/)(\d+)/g
  const match = url.match(regex)

  return match?.[0] ?? null
}

const getContentIdFromClip = (url: string): string | null => {
  const separatedUrl = url.split('/')

  if (separatedUrl.length === 0) return null

  return separatedUrl[separatedUrl.length - 1].split(/[?#]/)[0] || null
}
