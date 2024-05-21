import { getContentIdFromUrl } from '../downloader/getContentId.ts'
import { ContentTypes } from '../downloader/detectContentType.ts'

describe('getContentId', () => {
  it('should return ID from Live URL', () => {
    expect(
      getContentIdFromUrl(ContentTypes.LIVE, 'https://www.twitch.tv/username')
    ).toBe('username')
  })

  it('should return null from Live URL', () => {
    expect(
      getContentIdFromUrl(ContentTypes.LIVE, 'https://www.twitch.tv/')
    ).toBe(null)
  })

  it('should return ID from Clip URL', () => {
    expect(
      getContentIdFromUrl(
        ContentTypes.CLIP,
        'https://www.twitch.tv/clip/123456789'
      )
    ).toBe('123456789')
  })

  it('should return null from Clip URL', () => {
    expect(
      getContentIdFromUrl(ContentTypes.CLIP, 'https://www.twitch.tv/clip/')
    ).toBe(null)
  })

  it('should return ID from VOD URL', () => {
    expect(
      getContentIdFromUrl(
        ContentTypes.VOD,
        'https://www.twitch.tv/videos/123456789'
      )
    ).toBe('123456789')
  })

  it('should return null from VOD URL', () => {
    expect(
      getContentIdFromUrl(ContentTypes.VOD, 'https://www.twitch.tv/videos/')
    ).toBe(null)
  })
})
