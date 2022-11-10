import { describe, expect, it } from 'vitest'
import Playlist from '../src/main/interfaces/Playlist'
import { getAuth, getFeedFromId, getIdFromUrl } from '../src/main/services/twitch.service'
import Credentials from '../src/main/interfaces/Credentials'
import { download } from '../src/main/controllers/vod.controller'
import * as fs from 'fs'

const url = 'https://www.twitch.tv/videos/839518098?filter=all&sort=time'
const id = '839518098'
let credential: Credentials

const videoFeed: Playlist = {
  video: '160p30',
  quality: '160x120',
  url: 'https://d2nvs31859zcd8.cloudfront.net/497098a0678fbd887f14_twitch_40976239230_1608141314/160p30/index-dvr.m3u8',
  framerate: 30,
  bandwidth: 205123,
  codecs: 'avc1.4d401f,mp4a.40.2'
}

const audioFeed: Playlist = {
  video: 'audio_only',
  quality: null,
  url: 'https://d2nvs31859zcd8.cloudfront.net/497098a0678fbd887f14_twitch_40976239230_1608141314/audio_only/index-dvr.m3u8',
  framerate: null,
  bandwidth: 80545,
  codecs: 'mp4a.40.2'
}

describe('Get ID from URL', async () => {
  it('should return the ID from the URL', async () => {
    expect(getIdFromUrl(url)).toBe(id)
  })
})

describe('Auth from Twitch', async () => {
  credential = await getAuth(id, true)

  const isBase64 = (str: string) => {
    try {
      return btoa(atob(str)) == str
    } catch (err) {
      return false
    }
  }

  it('should return credentials', () => {
    expect(credential).not.toBe(null)
  })

  it('should return a valid signature', () => {
    expect(isBase64(credential.signature)).toBe(true)
  })
})

describe('Get feed from ID', async () => {
  const response = await getFeedFromId(id, credential)
  const responseData: string = response.data

  it('should return not null', () => {
    expect(responseData).not.toBe(null)
  })

  it('should return a string', () => {
    expect(responseData).toBeTypeOf('string')
  })

  it('should contain m3u8', () => {
    const containsM3u8 = responseData.includes('m3u8')
    expect(containsM3u8).toBe(true)
  })
})

describe('Download feed', async () => {
  const downloadVideo: boolean = await download(videoFeed, 'test/tmp/video.mp4')
  const downloadAudio: boolean = await download(audioFeed, 'test/tmp/audio.mp3')

  it('should download a video feed', async () => {
    expect(downloadVideo).toBe(true)
  })

  it('should download an audio feed', async () => {
    expect(downloadAudio).toBe(true)
  })

  const videoExists: boolean = fs.existsSync('test/tmp/video.mp4')
  it('video should be present in tmp folder', () => {
    expect(videoExists).toBe(true)
  })

  const audioExists: boolean = fs.existsSync('test/tmp/audio.mp3')
  it('audio should be present in tmp folder', () => {
    expect(audioExists).toBe(true)
  })
})
