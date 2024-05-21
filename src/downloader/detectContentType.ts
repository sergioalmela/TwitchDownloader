export enum ContentTypes {
  'VOD' = 'vod',
  'LIVE' = 'live',
  'CLIP' = 'clip'
}

const isVod = /videos\/\d+/i
const isClip = /clip\//i
const isLive = /\.tv\/([a-z0-9_]+)($|\?)/i

export const detectContentType = (url: string): ContentTypes | null => {
  if (isVod.test(url)) return ContentTypes.VOD
  if (isClip.test(url)) return ContentTypes.CLIP
  if (isLive.test(url)) return ContentTypes.LIVE
  return null
}
