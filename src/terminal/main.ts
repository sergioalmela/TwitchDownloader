// Terminal options to download content from Twitch (No GUI)
import { download } from '../main/services/file.service'
import { getFeeds } from '../main/controllers/feed.controller'
import Menu from '../main/interfaces/Menu'
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
    message: "Menu:\nStreams:\n1. Get a live stream link (get the M3U8 stream link of a live stream).\n2. Download a stream live. (Currently unavailable, coming in the beta)\n\nVODs:\n3. Get the link to a VOD (including sub-only).\n4. Download a VOD (including sub-only).\n5. Recover a VOD - 60 days maximum (can be less in rare cases).\n\nHighlights:\n6. Retrieve the link to a highlight.\n7. Download a highlight.\n8. Recover a highlight.\n\nVideos:\n9. Check if a VOD/highlight has muted segments.\n10. 'Unmute' a VOD/highlight (be able to view the muted segments of the M3U8).\n11. Download an M3U8 file.\n12. Convert a TS file to MP4.\n\nClips:\n13. Retrieve permanent link of a clip - never deleted.\n14. Download a clip.\n15. Recover ALL clips from a stream - NO time limit.\n\nMass options: (Currently unavailable, coming in the beta)\n16. Mass recover options. (Currently unavailable, coming in the beta)\n17. Mass download options. (Currently unavailable, coming in the beta)\nPlease enter the number of the option you want to select (number between 1-17 inclusive)"
  }, { onCancel })

  if (response.menu === '1') {
    console.log('Download a video')
  } else if (response.menu === '2') {
    console.log('Download a clip')
  } else if (response.menu === '3') {
    console.log('Download a stream')
  } else if (response.menu === '4') {
    console.log('Download VOD')
    downloadVod()
  } else {
    console.log('Invalid option')
    main()
  }
}

main()

async function downloadVod (): Promise<any> {
  interface Url {
    url: string
  }

  const response: Url = await prompts({
    type: 'text',
    name: 'url',
    message: 'Enter the Twitch video URL'
  })

  const url: string = response.url

  // const path = input("Enter the local path to download (or empty to download here): ")
  const path = null

  // Download VOD from Twitch
  const feeds = await getFeeds(url)
  const feedOptions = feeds.map((feed: Playlist, index) => {
    return {
      title: feed.video,
      value: feed.video
    }
  })

  // Iterate feeds, and promp user to download a feed showing video
  const responseFeeds: Menu = await prompts({
    type: 'select',
    name: 'selectQuality',
    message: 'Select the export quality',
    choices: feedOptions,
    initial: 1
  }, { onCancel })

  download()

  // Parse and sanitize URL first to get the ID, the we should make auth validation
  // VodController.getVod(credentials, id)
}
