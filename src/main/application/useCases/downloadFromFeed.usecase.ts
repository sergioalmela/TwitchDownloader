import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IDownloadRepository } from '../../domain/repository/downloadRepository.interface'
import { PathVo } from '../../domain/valueObjects/path.vo'

@injectable()
export class DownloadFromFeedUseCase {
  constructor (
    @inject(ContainerSymbols.DownloadRepository)
    private readonly downloadRepository: IDownloadRepository
  ) {}

  async execute (url: UrlVo, path: PathVo): Promise<any> {
    return await this.downloadRepository.download(url, path)
  }
}
