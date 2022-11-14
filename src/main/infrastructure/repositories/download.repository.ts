import { injectable } from 'inversify'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IDownloadRepository } from '../../domain/repository/downloadRepository.interface'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { FileVo } from '../../domain/valueObjects/file.vo'
import Segment from '../../interfaces/Segment'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'

const fs = require('fs')
const m3u8stream = require('m3u8stream')
const mkdirp = require('mkdirp')
const cliProgress = require('cli-progress')

const barFormat = {
  format: 'Progress [{bar}] {percentage}% | ETA: {eta_formatted} | ET: {duration_formatted}'
}

@injectable()
export class DownloadRepository implements IDownloadRepository {
  async download (url: UrlVo, path: PathVo, file: FileVo, extension: ExtensionVo): Promise<any> {
    return await new Promise((resolve) => {
      const stream = m3u8stream(url.value)

      mkdirp.sync(path.value)

      stream.pipe(fs.createWriteStream(path.value + file.value + extension.value))

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
}

function getDownloadPercentage (segment: Segment, totalSegments: number): number {
  return Math.round(segment.num / totalSegments * 100)
}
