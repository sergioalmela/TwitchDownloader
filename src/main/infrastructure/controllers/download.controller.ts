import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { DownloadVodFromFeedUseCase } from '../../application/useCases/downloadVodFromFeed.usecase'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { FileVo } from '../../domain/valueObjects/file.vo'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'
import { ContentTypes } from '../../domain/constants/contentTypes.enum'
import { DownloadClipFromFeedUseCase } from '../../application/useCases/downloadClipFromFeed.usecase'
import { DownloadLiveFromFeedUseCase } from '../../application/useCases/downloadLiveFromFeed.usecase'

@injectable()
export class DownloadController {
  constructor (
    @inject(ContainerSymbols.DownloadVodFromFeedUseCase)
    private readonly downloadVodFromFeedUseCase: DownloadVodFromFeedUseCase,
    @inject(ContainerSymbols.DownloadClipFromFeedUseCase)
    private readonly downloadClipFromFeedUseCase: DownloadClipFromFeedUseCase,
    @inject(ContainerSymbols.DownloadLiveFromFeedUseCase)
    private readonly downloadLiveFromFeedUseCase: DownloadLiveFromFeedUseCase
  ) {}

  async download (type: ContentTypes, url: UrlVo, path: PathVo, file: FileVo, extension: ExtensionVo): Promise<any> {
    if (type === ContentTypes.VOD) {
      await this.downloadVodFromFeedUseCase.execute(url, path, file, extension)
    } else if (type === ContentTypes.CLIP) {
      await this.downloadClipFromFeedUseCase.execute(url, path, file, extension)
    } else if (type === ContentTypes.LIVE) {
      await this.downloadLiveFromFeedUseCase.execute(url, path, file, extension)
    } else {
      throw new Error('Invalid content type')
    }
  }
}
