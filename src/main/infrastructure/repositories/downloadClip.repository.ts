import { injectable } from 'inversify'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IDownloadRepository } from '../../domain/repository/downloadRepository.interface'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { FileVo } from '../../domain/valueObjects/file.vo'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'

import { createWriteStream } from 'fs'
import { sync } from 'mkdirp'
import * as cliProgress from 'cli-progress'
import axios from 'axios'
import { DownloadErrorException } from '../errors/downloadError.exception'

const barFormat = {
  format: 'Progress [{bar}] {percentage}% | ETA: {eta_formatted} | ET: {duration_formatted}'
}

@injectable()
export class DownloadClipRepository implements IDownloadRepository {
  async download (url: UrlVo, path: PathVo, file: FileVo, extension: ExtensionVo): Promise<any> {
    return await new Promise((resolve, reject) => {
      axios.get(url.value, {
        responseType: 'stream'
      }).then(({ data, headers }) => {
        const totalSegments: number = headers['content-length'] !== null && typeof headers['content-length'] !== 'undefined' ? parseInt(headers['content-length']) : 0
        let currentChunks: number = 0

        sync(path.value)

        const writer = createWriteStream(path.value + file.value + extension.value)

        data.pipe(writer)

        const progress = new cliProgress.SingleBar(barFormat, cliProgress.Presets.shades_classic)
        progress.start(100, 0)

        let previousPercentage: number = -1
        data.on('data', function (chunk: string) {
          const percentage: number = getDownloadPercentage(currentChunks, totalSegments)
          currentChunks += chunk.length

          if (previousPercentage !== percentage) {
            progress.update(percentage)
          }

          if (currentChunks === totalSegments) {
            progress.stop()
            resolve(true)
          }

          previousPercentage = percentage
        })

        data.on('error', function () {
          reject(new DownloadErrorException())
        })
      }).catch(() => {
        reject(new DownloadErrorException())
      })
    })
  }
}

function getDownloadPercentage (segment: number, totalSegments: number): number {
  return Math.round(segment / totalSegments * 100)
}
