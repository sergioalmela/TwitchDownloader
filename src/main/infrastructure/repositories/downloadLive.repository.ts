import { injectable } from 'inversify'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IDownloadRepository } from '../../domain/repository/downloadRepository.interface'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { FileVo } from '../../domain/valueObjects/file.vo'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'

import { createWriteStream } from 'fs'
import m3u8stream from 'm3u8stream'
import { sync } from 'mkdirp'

@injectable()
export class DownloadLiveRepository implements IDownloadRepository {
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

      console.log('Downloading live stream until it ends...')

      stream.on('end', function () {
        resolve(true)
      })

      stream.on('error', function () {
        resolve(false)
      })
    })
  }
}
