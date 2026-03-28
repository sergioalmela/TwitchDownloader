import { describe, it, expect } from 'vitest'
import { getAuthVariables } from '../downloader/auth/getAuthVariables.ts'
import { ContentTypes } from '../downloader/detectContentType.ts'

describe('getAuthVariables', () => {
  describe('LIVE', () => {
    it('should return correct variables for live content', () => {
      const result = getAuthVariables(ContentTypes.LIVE, 'streamer123')
      expect(result.operationName).toBe('PlaybackAccessToken')
      expect(result.variables.isLive).toBe(true)
      expect(result.variables.isVod).toBe(false)
      expect(result.variables.login).toBe('streamer123')
      expect(result.variables.vodID).toBe('')
    })

    it('should include persisted query extension', () => {
      const result = getAuthVariables(ContentTypes.LIVE, 'streamer123')
      expect(result.extensions?.persistedQuery.version).toBe(1)
      expect(result.extensions?.persistedQuery.sha256Hash).toBeDefined()
    })
  })

  describe('VOD', () => {
    it('should return correct variables for VOD content', () => {
      const result = getAuthVariables(ContentTypes.VOD, '123456789')
      expect(result.operationName).toBe('PlaybackAccessToken')
      expect(result.variables.isLive).toBe(false)
      expect(result.variables.isVod).toBe(true)
      expect(result.variables.vodID).toBe('123456789')
      expect(result.variables.login).toBe('')
    })
  })

  describe('CLIP', () => {
    it('should return correct variables for clip content', () => {
      const result = getAuthVariables(ContentTypes.CLIP, 'MyClipSlug')
      expect(result.operationName).toBe('VideoAccessToken_Clip')
      expect(result.variables.slug).toBe('MyClipSlug')
    })

    it('should use a different persisted query hash than live/vod', () => {
      const clip = getAuthVariables(ContentTypes.CLIP, 'slug')
      const live = getAuthVariables(ContentTypes.LIVE, 'user')
      expect(clip.extensions?.persistedQuery.sha256Hash).not.toBe(
        live.extensions?.persistedQuery.sha256Hash
      )
    })
  })
})
