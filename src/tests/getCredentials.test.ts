import { fetch } from '@tauri-apps/plugin-http'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCredentials } from '../downloader/auth/getCredentials.ts'
import { ContentTypes } from '../downloader/detectContentType.ts'

vi.mock('@tauri-apps/plugin-http', () => ({ fetch: vi.fn() }))

const mockedFetch = vi.mocked(fetch)
const TOKEN = { signature: 'sig', value: '{"channel":"test"}' }

const respond = (status: number, body: unknown) => {
  mockedFetch.mockResolvedValue(
    new Response(JSON.stringify(body), { status }) as Response,
  )
}

describe('getCredentials', () => {
  beforeEach(() => {
    mockedFetch.mockReset()
  })

  it('should return the live access token', async () => {
    respond(200, { data: { streamPlaybackAccessToken: TOKEN } })
    await expect(getCredentials(ContentTypes.LIVE, 'test')).resolves.toEqual(
      TOKEN,
    )
  })

  it('should return the VOD access token', async () => {
    respond(200, { data: { videoPlaybackAccessToken: TOKEN } })
    await expect(getCredentials(ContentTypes.VOD, '123')).resolves.toEqual(
      TOKEN,
    )
  })

  it('should return the clip access token', async () => {
    respond(200, { data: { clip: { playbackAccessToken: TOKEN } } })
    await expect(getCredentials(ContentTypes.CLIP, 'slug')).resolves.toEqual(
      TOKEN,
    )
  })

  it('should throw when Twitch returns an HTTP error', async () => {
    respond(500, {})
    await expect(getCredentials(ContentTypes.VOD, '123')).rejects.toThrow(
      'Twitch returned HTTP 500',
    )
  })

  it('should throw when the clip does not exist', async () => {
    respond(200, { data: { clip: null } })
    await expect(getCredentials(ContentTypes.CLIP, 'missing')).rejects.toThrow(
      'Content not found',
    )
  })

  it('should throw when the VOD token is null', async () => {
    respond(200, { data: { videoPlaybackAccessToken: null } })
    await expect(getCredentials(ContentTypes.VOD, '1')).rejects.toThrow(
      'Content not found',
    )
  })
})
