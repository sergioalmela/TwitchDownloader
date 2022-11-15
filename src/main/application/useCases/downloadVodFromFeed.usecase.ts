import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IDownloadRepository } from '../../domain/repository/downloadRepository.interface'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { FileVo } from '../../domain/valueObjects/file.vo'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'

@injectable()
export class DownloadVodFromFeedUseCase {
  constructor (
    @inject(ContainerSymbols.DownloadVodRepository)
    private readonly downloadRepository: IDownloadRepository
  ) {}

  async execute (url: UrlVo, path: PathVo, file: FileVo, extension: ExtensionVo): Promise<any> {
    return await this.downloadRepository.download(url, path, file, extension)
  }
}
