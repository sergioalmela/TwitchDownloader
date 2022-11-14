import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { UrlVodRepository } from '../../infrastructure/repositories/urlVod.repository'
import { IdVo } from '../../domain/valueObjects/id.vo'

@injectable()
export class GetVodIdFromUrlUseCase {
  constructor (
    @inject(ContainerSymbols.UrlVodRepository)
    private readonly pathRepository: UrlVodRepository
  ) {}

  execute (url: UrlVo): IdVo {
    return this.pathRepository.getId(url)
  }
}
