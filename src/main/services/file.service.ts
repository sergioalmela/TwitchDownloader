import Segment from '../interfaces/Segment'
import Playlist from '../interfaces/Playlist'

const fs = require('fs')
const m3u8stream = require('m3u8stream')
const mkdirp = require('mkdirp')
const cliProgress = require('cli-progress')

const download = (selectedFeed: Playlist, path: string) => {
  // TODO: Set error control
  mkdirp(path).then(() => {
    const extension = selectedFeed.url === 'audio_only' || selectedFeed.codecs.startsWith('mp4a') ? 'mp3' : 'mp4'
    path = `${addFileName(path)}.${extension}`
    const stream = m3u8stream(selectedFeed.url)
    stream.pipe(fs.createWriteStream(path))

    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
    progress.start(100, 0)

    let previousPercentage = -1
    stream.on('progress', function (segment: Segment, totalSegments: number) {
      const percentage = getDownloadPercentage(segment, totalSegments)

      if (previousPercentage !== percentage) {
        progress.update(percentage)
      }

      if (segment.num === totalSegments) {
        progress.stop()
        return true
      }

      previousPercentage = percentage
    })
  })
}

const getDownloadPercentage = (segment: Segment, totalSegments: number) => {
  return Math.round(segment.num / totalSegments * 100)
}

// Trim the last slash if there is one to avoid double slash
const parsePath = (path: string) => {
  return `${path.replace(/\/$/, '')}`
}

// Remove extension from path, if there is no extension, then add default name 'twitchDownload'
const addFileName = (path: string) => {
  // If path is empty, then remove slash
  const defaultName = 'twitchDownload'

  return path.split('.').length > 1
    ? path
    : path === '' ? defaultName : `${path}/${defaultName}`
}

export {
  download,
  parsePath
}
