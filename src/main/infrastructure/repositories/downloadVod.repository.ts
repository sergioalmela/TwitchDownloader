import { injectable } from 'inversify'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IDownloadRepository } from '../../domain/repository/downloadRepository.interface'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { FileVo } from '../../domain/valueObjects/file.vo'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'

import { createWriteStream } from 'fs'
import m3u8stream from 'm3u8stream'
import { sync } from 'mkdirp'
import * as cliProgress from 'cli-progress'
import Segment from '../types/Segment'

const barFormat = {
  format: 'Progress [{bar}] {percentage}% | ETA: {eta_formatted} | ET: {duration_formatted}'
}

@injectable()
export class DownloadVodRepository implements IDownloadRepository {
  async download (url: UrlVo, path: PathVo, file: FileVo, extension: ExtensionVo): Promise<any> {
    return await new Promise((resolve) => {
      const stream = m3u8stream(url.value, {
        requestOptions: {
          transform: (url: any) => {
            // Replace 'unmuted' to 'muted' in the url
            url.path = url.path.replace('-unmuted', '-muted')
            return url
          }
        }
      })

      sync(path.value)

      stream.pipe(createWriteStream(path.value + file.value + extension.value))

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
