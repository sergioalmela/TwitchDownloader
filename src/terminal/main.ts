// Terminal options to download content from Twitch (No GUI)
import 'reflect-metadata'
import container from '../main/container'
import {ContainerSymbols} from '../main/symbols'
import {FeedController} from '../main/infrastructure/controllers/feed.controller'
import {UrlVo} from '../main/domain/valueObjects/url.vo'
import {PlaylistVo} from '../main/domain/valueObjects/playlist.vo'
import {FeedVo} from '../main/domain/valueObjects/feed.vo'
import DownloadPath from '../main/infrastructure/types/prompt/DownloadPath'
import ExportQuality from '../main/infrastructure/types/prompt/ExportQuality'
import {PathVo} from '../main/domain/valueObjects/path.vo'
import {DownloadController} from '../main/infrastructure/controllers/download.controller'
import {FileVo} from '../main/domain/valueObjects/file.vo'
import {FileController} from '../main/infrastructure/controllers/file.controller'

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
const prompts = require('prompts')

const onCancel = () => {
  process.exit()
}

downloadVod()

// TODO: Check if is valid twitch URL
async function downloadVod (): Promise<any> {
  const response: Url = await prompts({
    type: 'text',
    name: 'url',
    message: 'Enter the Twitch video URL'
  }, { onCancel })

  const url: UrlVo = new UrlVo(response.url)

  const feeds: PlaylistVo[] = await feedsController.getFeeds(url)

  const feedOptions: FeedVo[] = feedsController.parseFeeds(feeds)

  const pathPrompt: DownloadPath = await prompts({
    type: 'text',
    name: 'downloadPath',
    message: 'Enter the path to download the video (absolute or relative) Ex: /Videos/myDownload.mp4'
  }, { onCancel })

  const path = new PathVo(pathPrompt.downloadPath)

  const file: FileVo = fileController.getFileNameFromPath(pathPrompt.downloadPath)

  const responseFeeds: ExportQuality = await prompts({
    type: 'select',
    name: 'exportQuality',
    message: 'Select the export quality',
    choices: feedOptions.map(a => a.value),
    initial: 1
  }, { onCancel })

  const selectedFeed: PlaylistVo = feeds[responseFeeds.exportQuality]

  const downloadUrl: UrlVo = new UrlVo(selectedFeed.value.url)

  await downloadController.download(downloadUrl, path, file)
}
