import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {ContentTypes} from '../../domain/constants/contentTypes.enum'
import {ContentRepository} from '../../infrastructure/repositories/content.repository'
import {UrlVo} from '../../domain/valueObjects/url.vo'

@injectable()
export class DetectContentTypeUseCase {
  constructor (
    @inject(ContainerSymbols.ContentRepository)
    private readonly contentRepository: ContentRepository
  ) {}

  execute (url: UrlVo): ContentTypes {
    return this.contentRepository.getContentType(url)
  }
}
