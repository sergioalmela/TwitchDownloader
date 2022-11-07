// Terminal options to download content from Twitch (No GUI)
import { download, parsePath } from '../main/services/file.service'
import { getFeedOptions, getFeeds } from '../main/controllers/feed.controller'
import FeedOption from '../main/interfaces/FeedOption'
import Feed from '../main/interfaces/Feed'
import Menu from '../main/interfaces/prompt/Menu'
import DownloadPath from '../main/interfaces/prompt/DownloadPath'
import ExportQuality from '../main/interfaces/prompt/ExportQuality'
import Playlist from '../main/interfaces/Playlist'

export {}
const prompts = require('prompts')

const onCancel = prompt => {
  process.exit()
}

async function main (): Promise<any> {
  const response: Menu = await prompts({
    type: 'text',
    name: 'menu',
    message: 'Menu:\n1. Download a stream (Unavailable)\n2. Download a clip (Unavailable)\n3. Download a video\nPlease enter the number of the option you want to select (number between 1-3)'
  }, { onCancel })

  if (response.menu === '1') {
    console.log('Download a Stream')
  } else if (response.menu === '2') {
    console.log('Download a clip')
  } else if (response.menu === '3') {
    console.log('Download VOD')
    downloadVod()
  } else {
    console.log('Invalid option')
    main()
  }
}

main()

// TODO: Check if is valid twitch URL
async function downloadVod (): Promise<any> {
  const response: Url = await prompts({
    type: 'text',
    name: 'url',
    message: 'Enter the Twitch video URL'
  })

  const url: string = response.url

  // TODO: Check if path has extension, if not, ask again
  const path: DownloadPath = await prompts({
    type: 'text',
    name: 'downloadPath',
    message: 'Enter the path to download the video (absolute or relative) Ex: /Videos/myDownload.mp4'
  }, { onCancel })

  const feeds: Feed = await getFeeds(url)
  const feedOptions: FeedOption = await getFeedOptions(feeds)

  // Iterate feeds, and promp user to download a feed showing video
  const responseFeeds: ExportQuality = await prompts({
    type: 'select',
    name: 'exportQuality',
    message: 'Select the export quality',
    choices: feedOptions,
    initial: 1
  }, { onCancel })

  const selectedFeed: Playlist = feeds[responseFeeds.exportQuality]

  // TODO: Set error control in every iteration
  await download(selectedFeed, parsePath(path.downloadPath))
}
