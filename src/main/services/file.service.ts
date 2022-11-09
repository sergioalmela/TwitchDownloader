import Segment from '../interfaces/Segment'
import Playlist from '../interfaces/Playlist'

const fs = require('fs')
const m3u8stream = require('m3u8stream')
const mkdirp = require('mkdirp')
const cliProgress = require('cli-progress')

const barFormat = {
  format: 'Progress [{bar}] {percentage}% | ETA: {eta_formatted} | ET: {duration_formatted}'
}

const downloadFromFeed = async (selectedFeed: Playlist, path: string): Promise<boolean> => {
  path = parsePath(path)
  const cleanPath: string = path.split('.').length > 1 ? path.split('/').slice(0, -1).join('/') : path

  mkdirp.sync(cleanPath)

  const extension = getExtension(selectedFeed)
  path = `${addFileName(path)}.${extension}`

  return await downloadStream(selectedFeed.url, path)
}

const downloadStream = async (url: string, path: string): Promise<boolean> => {
  return await new Promise((resolve) => {
    const stream = m3u8stream(url)
    stream.pipe(fs.createWriteStream(path))

    const progress = new cliProgress.SingleBar(barFormat, cliProgress.Presets.shades_classic)
    progress.start(100, 0)

    let previousPercentage: number = -1
    stream.on('progress', function (segment: Segment, totalSegments: number) {
      const percentage: number = getDownloadPercentage(segment, totalSegments)

      if (previousPercentage !== percentage) {
        progress.update(percentage)
      }

      if (segment.num === totalSegments) {
        progress.stop()
        resolve(true)
      }

      previousPercentage = percentage
    })

    stream.on('error', function () {
      resolve(false)
    })
  })
}

const getExtension = (playlist: Playlist): string => {
  return playlist.url === 'audio_only' || playlist.codecs.startsWith('mp4a') ? 'mp3' : 'mp4'
}

const getDownloadPercentage = (segment: Segment, totalSegments: number): number => {
  return Math.round(segment.num / totalSegments * 100)
}

// Trim the last slash if there is one to avoid double slash
const parsePath = (path: string): string => {
  return `${path.replace(/\/$/, '')}`
}

// Remove extension from path, if there is no extension, then add default name 'twitchDownload'
const addFileName = (path: string): string => {
  // If path is empty, then remove slash and remove extension (only mp4 support yet)
  const defaultName = 'twitchDownload'

  return path.split('.').length > 1
    ? path.split('.').slice(0, -1).join('.')
    : path === '' ? defaultName : `${path}/${defaultName}`
}

export {
  downloadFromFeed
}
