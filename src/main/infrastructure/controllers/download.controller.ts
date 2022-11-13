import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { DownloadFromFeedUseCase } from '../../application/useCases/downloadFromFeed.usecase'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { UrlVo } from '../../domain/valueObjects/url.vo'

@injectable()
export class DownloadController {
  constructor (
    @inject(ContainerSymbols.DownloadFromFeedUseCase)
    private readonly downloadFromFeedUseCase: DownloadFromFeedUseCase
  ) {}

  async download (url: UrlVo, path: PathVo): Promise<any> {
    return await this.downloadFromFeedUseCase.execute(url, path)
  }
}
