import {
  ContentTypes,
  detectContentType
} from '../downloader/detectContentType.ts'

describe('detectContentType', () => {
  it('should return VOD', () => {
    expect(detectContentType('https://www.twitch.tv/videos/123456789')).toBe(
      ContentTypes.VOD
    )
  })

  it('should return CLIP', () => {
    expect(detectContentType('https://www.twitch.tv/clip/123456789')).toBe(
      ContentTypes.CLIP
    )
  })

  it('should return LIVE', () => {
    expect(detectContentType('https://www.twitch.tv/username')).toBe(
      ContentTypes.LIVE
    )
  })

  it('should return null', () => {
    expect(detectContentType('https://www.twitch.tv/')).toBe(null)
  })
})
