// Terminal options to download content from Twitch (No GUI)
import 'reflect-metadata'
import container from '../main/container'
import { ContainerSymbols } from '../main/symbols'
import { FeedController } from '../main/infrastructure/controllers/feed.controller'
import { UrlVo } from '../main/domain/valueObjects/url.vo'
import { PlaylistVo } from '../main/domain/valueObjects/playlist.vo'
import { FeedVo } from '../main/domain/valueObjects/feed.vo'
import DownloadPath from '../main/infrastructure/types/prompt/DownloadPath'
import ExportQuality from '../main/infrastructure/types/prompt/ExportQuality'
import { PathVo } from '../main/domain/valueObjects/path.vo'
import { DownloadController } from '../main/infrastructure/controllers/download.controller'
import { FileVo } from '../main/domain/valueObjects/file.vo'
import { FileController } from '../main/infrastructure/controllers/file.controller'
import prompts from 'prompts'
import Url from '../main/infrastructure/types/prompt/Url'
import { ContentTypes } from '../main/domain/constants/contentTypes.enum'
import { IdVo } from '../main/domain/valueObjects/id.vo'

const feedsController = container.get<FeedController>(
  ContainerSymbols.FeedController
)

const downloadController = container.get<DownloadController>(
  ContainerSymbols.DownloadController
)

const fileController = container.get<FileController>(
  ContainerSymbols.FileController
)

export {}

const onCancel = (): void => {
  process.exit()
}

main().catch(console.error)

async function main (): Promise<any> {
  const response: Url = await prompts({
    type: 'text',
    name: 'url',
    message: 'Enter the Twitch URL (stream, vod, clip, highlight), or enter a .txt file with a list of URLs (new line separated)'
  }, { onCancel })

  const url = new UrlVo(response.url)

  // Mass download from txt if present
  if (url.value.endsWith('.txt')) {
    const filePath = new PathVo(url.value)
    const urls: UrlVo[] = fileController.getUrlsFromFile(filePath)
    for (const url of urls) {
      await downloadFromUrl(url)
    }
  } else {
    await downloadFromUrl(url)
  }
}

const downloadFromUrl = async (url: UrlVo): Promise<any> => {
  const type: ContentTypes = await feedsController.getContentType(url)

  const id: IdVo = await feedsController.getId(type, url)

  let path, file, responseFeeds

  // Ask if we should download the stream when it's live (qualities will not be available)
  let downloadLiveNotStarted = false
  if (type === ContentTypes.LIVE) {
    const notStartedPrompt = await prompts({
      type: 'confirm',
      name: 'downloadSteamNotStarted',
      message: `The stream ${id.value} is not live, do you want to download it when it starts?`
    })

    downloadLiveNotStarted = notStartedPrompt.downloadSteamNotStarted
  }

  // If it's a live stream, we can only download the original quality
  if (downloadLiveNotStarted) {
    const response = await askForDownloadPathAndQuality(id, [
      new FeedVo({
        title: 'Original',
        value: 0
      })
    ])
    path = response.path
    file = response.file
    responseFeeds = response.responseFeeds
  }

  const feeds: PlaylistVo[] = await feedsController.getFeeds(type, url)

  const feedOptions: FeedVo[] = feedsController.parseFeeds(feeds)

  if (!downloadLiveNotStarted) {
    const response = await askForDownloadPathAndQuality(id, feedOptions)
    path = response.path
    file = response.file
    responseFeeds = response.responseFeeds
  }

  const selectedFeed: PlaylistVo = feeds[responseFeeds.exportQuality]

  const extension = fileController.getExtensionFromPlaylist(selectedFeed)

  const downloadUrl: UrlVo = new UrlVo(selectedFeed.value.url)

  await downloadController.download(type, downloadUrl, path, file, extension)
}

const askForDownloadPathAndQuality = async (id: IdVo, feedOptions: FeedVo[]): Promise<any> => {
  const pathPrompt: DownloadPath = await prompts({
    type: 'text',
    name: 'downloadPath',
    message: `Enter the path to download the video ${id.value.toString()} (absolute or relative) Ex: /Videos/myDownload.mp4`
  }, { onCancel })

  const pathResponse = pathPrompt.downloadPath
  const path = new PathVo(pathResponse)

  const file: FileVo = fileController.getFileNameFromPath(path)
  file.removeExtensionFromFileName()

  path.removeFileFromPath()

  const responseFeeds: ExportQuality = await prompts({
    type: 'select',
    name: 'exportQuality',
    message: 'Select the export quality',
    choices: feedOptions.map(a => a.value),
    initial: 0
  }, { onCancel })

  return { path, file, responseFeeds }
}
