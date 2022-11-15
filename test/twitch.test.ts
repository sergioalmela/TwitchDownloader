import 'reflect-metadata'
import { describe, expect, it } from 'vitest'
import Credentials from '../src/main/infrastructure/types/Credential'
import { AuthVodUseCase } from '../src/main/application/useCases/authVod.usecase'
import container from '../src/main/container'
import { ContainerSymbols } from '../src/main/symbols'
import { IdVo } from '../src/main/domain/valueObjects/id.vo'
import { DetectContentTypeUseCase } from '../src/main/application/useCases/detectContentType.usecase'
import { UrlVo } from '../src/main/domain/valueObjects/url.vo'
import { ContentTypes } from '../src/main/domain/constants/contentTypes.enum'
import { GetVodIdFromUrlUseCase } from '../src/main/application/useCases/getVodIdFromUrl.usecase'
import { GetVodManifestUseCase } from '../src/main/application/useCases/getVodManifest.usecase'
import { GetExtensionFromPlaylistUseCase } from '../src/main/application/useCases/getExtensionFromPlaylist.usecase'
import { PlaylistVo } from '../src/main/domain/valueObjects/playlist.vo'
import { ManifestVo } from '../src/main/domain/valueObjects/manifest.vo'
import { GetFeedFromManifestUseCase } from '../src/main/application/useCases/getFeedFromManifest.usecase'
import { ParseFeedUseCase } from '../src/main/application/useCases/parseFeed.usecase'
import { GetFileFromPathUseCase } from '../src/main/application/useCases/getFileFromPath.usecase'
import { FileVo } from '../src/main/domain/valueObjects/file.vo'
import { PathVo } from '../src/main/domain/valueObjects/path.vo'
import { DownloadVodFromFeedUseCase } from '../src/main/application/useCases/downloadVodFromFeed.usecase'
import { FeedVo } from '../src/main/domain/valueObjects/feed.vo'
import { FileExtensions } from '../src/main/domain/constants/fileExtensions.enum'
import { ExtensionVo } from '../src/main/domain/valueObjects/extension.vo'

import { existsSync } from 'fs'

const authVodUseCase = container.get<AuthVodUseCase>(ContainerSymbols.AuthVodUseCase)
const detectContentTypeUseCase = container.get<DetectContentTypeUseCase>(ContainerSymbols.DetectContentTypeUseCase)
const getVodIdFromUrlUseCase = container.get<GetVodIdFromUrlUseCase>(ContainerSymbols.GetVodIdFromUrlUseCase)
const getVodManifestUseCase = container.get<GetVodManifestUseCase>(ContainerSymbols.GetVodManifestUseCase)
const getExtensionFromPlaylistUseCase = container.get<GetExtensionFromPlaylistUseCase>(ContainerSymbols.GetExtensionFromPlaylistUseCase)
const getFeedFromManifest = container.get<GetFeedFromManifestUseCase>(ContainerSymbols.GetFeedFromManifestUseCase)
const parseFeedUseCase = container.get<ParseFeedUseCase>(ContainerSymbols.ParseFeedUseCase)
const getFileFromPath = container.get<GetFileFromPathUseCase>(ContainerSymbols.GetFileFromPathUseCase)
const downloadVodFromFeedUseCase = container.get<DownloadVodFromFeedUseCase>(ContainerSymbols.DownloadVodFromFeedUseCase)

const urlVod: UrlVo = new UrlVo('https://www.twitch.tv/videos/839518098?filter=all&sort=time')
const urlClip: UrlVo = new UrlVo('https://www.twitch.tv/twitch/clip/SavageNurturingTruffleKippa?filter=clips&range=all&sort=time')
const idVod: IdVo = new IdVo('839518098')
let credentialVod: Credentials
let manifestVod: ManifestVo
const file: FileVo = new FileVo('downloadedFile.mp4')
const fileEmpty: FileVo = new FileVo('')
const path: PathVo = new PathVo('downloadedFile.mp4')
const pathEmpty: PathVo = new PathVo('test/tmp/')

const videoFeed: PlaylistVo = new PlaylistVo({
  video: '160p30',
  quality: '160x120',
  url: 'https://d2nvs31859zcd8.cloudfront.net/497098a0678fbd887f14_twitch_40976239230_1608141314/160p30/index-dvr.m3u8',
  framerate: 30,
  bandwidth: 205123,
  codecs: 'avc1.4d401f,mp4a.40.2'
})

const audioFeed: PlaylistVo = new PlaylistVo({
  video: 'audio_only',
  quality: null,
  url: 'https://d2nvs31859zcd8.cloudfront.net/497098a0678fbd887f14_twitch_40976239230_1608141314/audio_only/index-dvr.m3u8',
  framerate: null,
  bandwidth: 80545,
  codecs: 'mp4a.40.2'
})

describe('Auth from Twitch', async () => {
  credentialVod = await authVodUseCase.execute(idVod)
  // credentialClip = await authClipUseCase.execute(idClip)

  const isBase64 = (str: string): boolean => {
    try {
      return Buffer.from(str, 'base64').toString('base64') === str
    } catch (err) {
      return false
    }
  }

  it('should return VOD credentials', () => {
    expect(credentialVod).not.toBe(null)
  })

  it('should return a valid VOD signature', () => {
    expect(isBase64(credentialVod.signature)).toBe(true)
  })

  /* it('should return Clip credentials', () => {
    expect(credentialClip).not.toBe(null)
  })

  it('should return a valid Clip signature', () => {
    expect(isBase64(credentialClip.signature)).toBe(true)
  }) */
})

describe('Detect content type VOD from URL', async () => {
  it('should return the ID from the URL', async () => {
    expect(detectContentTypeUseCase.execute(urlVod)).toBe(ContentTypes.VOD)
  })
})

describe('Detect content type Clip from URL', async () => {
  it('should return the ID from the URL', async () => {
    expect(detectContentTypeUseCase.execute(urlClip)).toBe(ContentTypes.CLIP)
  })
})

describe('Detect content type Clip from URL', async () => {
  it('should return the ID from the URL', async () => {
    expect(detectContentTypeUseCase.execute(urlClip)).toBe(ContentTypes.CLIP)
  })
})

describe('Get ID from URL', async () => {
  it('should return the VOD ID from the URL', async () => {
    expect(getVodIdFromUrlUseCase.execute(urlVod)).toStrictEqual(idVod)
  })

  /* it('should return the Clip ID from the URL', async () => {
    expect(getClipIdFromUrlUseCase.execute(urlClip)).toStrictEqual(idClip)
  }) */
})

describe('Get Manifest', async () => {
  it('should return the VOD manifest', async () => {
    manifestVod = await getVodManifestUseCase.execute(idVod, credentialVod)
    expect(manifestVod).not.toBe(null)
    expect(manifestVod).toBeTypeOf('object')
  })
})

describe('Get Extension', async () => {
  it('should return the extension of the file from video', async () => {
    getExtensionFromPlaylistUseCase.execute(videoFeed)
  })

  it('should return the extension of the file from audio', async () => {
    getExtensionFromPlaylistUseCase.execute(audioFeed)
  })
})

describe('Get Feed from Manifest', async () => {
  it('should return the VOD feed', async () => {
    const feed: PlaylistVo[] = getFeedFromManifest.execute(manifestVod)
    expect(feed).not.toBe(null)
    expect(feed[0].value).toHaveProperty('video')
    expect(feed[0].value).toHaveProperty('url')
  })
})

describe('Get file from Path', async () => {
  it('should return the file without extension', async () => {
    expect(getFileFromPath.execute(path)).toStrictEqual(file)
  })

  it('should return the default value of empty file without extension', async () => {
    expect((getFileFromPath.execute(pathEmpty)).value).toStrictEqual(fileEmpty.getDefaultValue())
  })
})

describe('Parse Feed', async () => {
  it('should return the parsed feed', async () => {
    const feed: PlaylistVo[] = getFeedFromManifest.execute(manifestVod)
    const parsedFeed: FeedVo[] = parseFeedUseCase.execute(feed)
    expect(parsedFeed).not.toBe(null)
    expect(parsedFeed[0].value).toHaveProperty('title')
    expect(parsedFeed[0].value).toHaveProperty('value')
  })
})

describe('Download feed', async () => {
  await downloadVodFromFeedUseCase.execute(urlVod, pathEmpty, fileEmpty, new ExtensionVo(FileExtensions.MP4))
  await downloadVodFromFeedUseCase.execute(urlVod, pathEmpty, fileEmpty, new ExtensionVo(FileExtensions.MP3))

  const videoExists: boolean = existsSync(pathEmpty.value + fileEmpty.getDefaultValue() + FileExtensions.MP4)
  it('video should be present in tmp folder', () => {
    expect(videoExists).toBe(true)
  })

  const audioExists: boolean = existsSync(pathEmpty.value + fileEmpty.getDefaultValue() + FileExtensions.MP3)
  it('audio should be present in tmp folder', () => {
    expect(audioExists).toBe(true)
  })
})
