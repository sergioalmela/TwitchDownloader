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
import { GetClipIdFromUrlUseCase } from '../src/main/application/useCases/getClipIdFromUrl.usecase'
import { GetVodManifestUseCase } from '../src/main/application/useCases/getVodManifest.usecase'
import { GetClipManifestUseCase } from '../src/main/application/useCases/getClipManifest.usecase'
import { GetExtensionFromPlaylistUseCase } from '../src/main/application/useCases/getExtensionFromPlaylist.usecase'
import { PlaylistVo } from '../src/main/domain/valueObjects/playlist.vo'
import { ManifestVo } from '../src/main/domain/valueObjects/manifest.vo'
import { GetFeedFromManifestUseCase } from '../src/main/application/useCases/getFeedFromManifest.usecase'
import { ParseFeedUseCase } from '../src/main/application/useCases/parseFeed.usecase'
import { GetFileFromPathUseCase } from '../src/main/application/useCases/getFileFromPath.usecase'
import { FileVo } from '../src/main/domain/valueObjects/file.vo'
import { PathVo } from '../src/main/domain/valueObjects/path.vo'
import { DownloadVodFromFeedUseCase } from '../src/main/application/useCases/downloadVodFromFeed.usecase'
import { GetUrlsFromTxtFileUseCase } from '../src/main/application/useCases/getUrlsFromTxtFile.usecase'
import { FeedVo } from '../src/main/domain/valueObjects/feed.vo'
import { FileExtensions } from '../src/main/domain/constants/fileExtensions.enum'
import { ExtensionVo } from '../src/main/domain/valueObjects/extension.vo'

import { existsSync, statSync, unlinkSync } from 'fs'

const authVodUseCase = container.get<AuthVodUseCase>(ContainerSymbols.AuthVodUseCase)
const authClipUseCase = container.get<AuthVodUseCase>(ContainerSymbols.AuthClipUseCase)
const detectContentTypeUseCase = container.get<DetectContentTypeUseCase>(ContainerSymbols.DetectContentTypeUseCase)
const getVodIdFromUrlUseCase = container.get<GetVodIdFromUrlUseCase>(ContainerSymbols.GetVodIdFromUrlUseCase)
const getClipIdFromUrlUseCase = container.get<GetClipIdFromUrlUseCase>(ContainerSymbols.GetClipIdFromUrlUseCase)
const getVodManifestUseCase = container.get<GetVodManifestUseCase>(ContainerSymbols.GetVodManifestUseCase)
const getClipManifestUseCase = container.get<GetClipManifestUseCase>(ContainerSymbols.GetClipManifestUseCase)
const getExtensionFromPlaylistUseCase = container.get<GetExtensionFromPlaylistUseCase>(ContainerSymbols.GetExtensionFromPlaylistUseCase)
const getFeedFromManifest = container.get<GetFeedFromManifestUseCase>(ContainerSymbols.GetFeedFromManifestUseCase)
const parseFeedUseCase = container.get<ParseFeedUseCase>(ContainerSymbols.ParseFeedUseCase)
const getFileFromPath = container.get<GetFileFromPathUseCase>(ContainerSymbols.GetFileFromPathUseCase)
const downloadVodFromFeedUseCase = container.get<DownloadVodFromFeedUseCase>(ContainerSymbols.DownloadVodFromFeedUseCase)
const getUrlsFromTxtFileUseCase = container.get<GetUrlsFromTxtFileUseCase>(ContainerSymbols.GetUrlsFromTxtFileUseCase)

const urlVod: UrlVo = new UrlVo('https://www.twitch.tv/videos/839518098?filter=all&sort=time')
const urlClip: UrlVo = new UrlVo('https://www.twitch.tv/twitch/clip/SavageNurturingTruffleKippa?filter=clips&range=all&sort=time')
const idVod: IdVo = new IdVo('839518098')
const idVodRestricted: IdVo = new IdVo('607610942')
let credentialVod: Credentials
let credentialVodRestricted: Credentials
let credentialClip: Credentials
const idClip: IdVo = new IdVo('SavageNurturingTruffleKippa')
let manifestVod: ManifestVo
let manifestClip: ManifestVo
const file: FileVo = new FileVo('downloadedFile.mp4')
const fileEmpty: FileVo = new FileVo('')
const path: PathVo = new PathVo('downloadedFile.mp4')
const pathBackslashes: PathVo = new PathVo('test\\tmp\\downloadedFile.mp4')
const pathEmpty: PathVo = new PathVo('test/tmp/')
const massFilePath: PathVo = new PathVo('test/tmp/list.txt')

const videoFeed: PlaylistVo = new PlaylistVo({
  video: '160p30',
  quality: { width: 160, height: 120 },
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

const videoFeedRestricted: PlaylistVo = new PlaylistVo({
  video: '360p30',
  quality: { width: 360 },
  url: 'https://d2nvs31859zcd8.cloudfront.net/74c0c14ddce605938762_dj_spen_93583666764_8388699465/360p30/highlight-607610942.m3u8?sig=8d93636e618ccfcbd38e2ead97b936c1670b10be&token=%7B%22authorization%22%3A%7B%22forbidden%22%3Afalse%2C%22reason%22%3A%22%22%7D%2C%22chansub%22%3A%7B%22restricted_bitrates%22%3A%5B%22160p30%22%2C%22360p30%22%2C%22480p30%22%2C%22720p30%22%2C%22audio_only%22%2C%22chunked%22%5D%7D%2C%22device_id%22%3Anull%2C%22expires%22%3A1668835161%2C%22https_required%22%3Atrue%2C%22privileged%22%3Afalse%2C%22user_id%22%3Anull%2C%22version%22%3A2%2C%22vod_id%22%3A607610942%7D',
  framerate: 29.998993191868916,
  bandwidth: 0,
  codecs: 'avc1.4D402A,mp4a.40.2'
})

const videoDownloadUrl: UrlVo = new UrlVo(videoFeed.value.url)
const audioDownloadUrl: UrlVo = new UrlVo(audioFeed.value.url)
const videoDownloadUrlRestricted: UrlVo = new UrlVo(videoFeedRestricted.value.url)

// TODO: Can't e2e live stream, need to find a way to find a random live stream
describe('Auth from Twitch', async () => {
  credentialVod = await authVodUseCase.execute(idVod)
  credentialClip = await authClipUseCase.execute(idClip)
  credentialVodRestricted = await authVodUseCase.execute(idVodRestricted)

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

  it('should return VOD restricted credentials', () => {
    expect(credentialVodRestricted).not.toBe(null)
  })

  it('should return a valid VOD restricted signature', () => {
    expect(isBase64(credentialVodRestricted.signature)).toBe(true)
  })

  it('should return Clip credentials', () => {
    expect(credentialClip).not.toBe(null)
  })

  it('should return a valid Clip signature', () => {
    expect(isBase64(credentialClip.signature)).toBe(true)
  })
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

  it('should return the Clip ID from the URL', async () => {
    expect(getClipIdFromUrlUseCase.execute(urlClip)).toStrictEqual(idClip)
  })
})

describe('Get Manifest', async () => {
  it('should return the VOD manifest', async () => {
    manifestVod = await getVodManifestUseCase.execute(idVod, credentialVod)
    expect(manifestVod).not.toBe(null)
    expect(manifestVod).toBeTypeOf('object')
  })

  it('should return the Clip manifest', async () => {
    manifestClip = await getClipManifestUseCase.execute(idClip, credentialClip)
    expect(manifestClip).not.toBe(null)
    expect(manifestClip).toBeTypeOf('object')
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

  it('should return the Clip feed', async () => {
    const feed: PlaylistVo[] = getFeedFromManifest.execute(manifestClip)
    expect(feed).not.toBe(null)
    expect(feed[0].value).toHaveProperty('video')
    expect(feed[0].value).toHaveProperty('url')
  })
})

describe('Get file from Path', async () => {
  it('should return the file without extension', async () => {
    expect(getFileFromPath.execute(path)).toStrictEqual(file)
  })

  it('should return the backslashes file without extension', async () => {
    expect(getFileFromPath.execute(pathBackslashes)).toStrictEqual(file)
  })

  it('should return the default value of empty file without extension', async () => {
    expect(getFileFromPath.execute(pathEmpty).value).toMatch(fileEmpty.getDefaultName())
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

describe('Read file', async () => {
  it('should return the file content of txt file', async () => {
    const urls: UrlVo[] = getUrlsFromTxtFileUseCase.execute(massFilePath)
    expect(urls).not.toBe(null)
    expect(urls.length).toBe(2)
  })
})

describe('Download feed', async () => {
  const downloadVideoResult = await downloadVodFromFeedUseCase.execute(videoDownloadUrl, pathEmpty, fileEmpty, new ExtensionVo(FileExtensions.MP4))
  const downloadAudioResult = await downloadVodFromFeedUseCase.execute(audioDownloadUrl, pathEmpty, fileEmpty, new ExtensionVo(FileExtensions.MP3))

  const videoExists: boolean = existsSync(pathEmpty.value + fileEmpty.getValue() + FileExtensions.MP4)
  const videoSize: number = statSync(pathEmpty.value + fileEmpty.getValue() + FileExtensions.MP4).size
  unlinkSync(pathEmpty.value + fileEmpty.getValue() + FileExtensions.MP4)
  it('video should be present in tmp folder', () => {
    expect(videoExists).toBe(true)
    expect(videoSize).toBeGreaterThan(0)
    expect(downloadVideoResult).toBe(true)
  })

  const audioExists: boolean = existsSync(pathEmpty.value + fileEmpty.getValue() + FileExtensions.MP3)
  const audioSize: number = statSync(pathEmpty.value + fileEmpty.getValue() + FileExtensions.MP3).size
  unlinkSync(pathEmpty.value + fileEmpty.getValue() + FileExtensions.MP3)
  it('audio should be present in tmp folder', () => {
    expect(audioExists).toBe(true)
    expect(audioSize).toBeGreaterThan(0)
    expect(downloadAudioResult).toBe(true)
  })
})

describe('Download feed restricted', async () => {
  const downloadVideoResult = await downloadVodFromFeedUseCase.execute(videoDownloadUrlRestricted, pathEmpty, fileEmpty, new ExtensionVo(FileExtensions.MP4))

  const videoExists: boolean = existsSync(pathEmpty.value + fileEmpty.getValue() + FileExtensions.MP4)
  const videoSize: number = statSync(pathEmpty.value + fileEmpty.getValue() + FileExtensions.MP4).size
  unlinkSync(pathEmpty.value + fileEmpty.getValue() + FileExtensions.MP4)
  it('video restricted should be present in tmp folder', () => {
    expect(videoExists).toBe(true)
    expect(videoSize).toBeGreaterThan(0)
    expect(downloadVideoResult).toBe(true)
  })
})
