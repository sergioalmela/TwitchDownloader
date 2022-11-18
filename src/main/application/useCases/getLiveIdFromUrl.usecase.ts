import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { IUrlRepository } from '../../domain/repository/urlRepository.interface'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IdVo } from '../../domain/valueObjects/id.vo'

@injectable()
export class GetLiveIdFromUrlUseCase {
  constructor (
    @inject(ContainerSymbols.UrlLiveRepository)
    private readonly pathRepository: IUrlRepository
  ) {}

  execute (url: UrlVo): IdVo {
    return this.pathRepository.getId(url)
  }
}
