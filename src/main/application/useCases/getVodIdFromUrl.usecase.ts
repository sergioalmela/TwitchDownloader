import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { PathVodRepository } from '../../infrastructure/repositories/pathVod.repository'
import { IdVo } from '../../domain/valueObjects/id.vo'

@injectable()
export class GetVodIdFromUrlUseCase {
  constructor (
    @inject(ContainerSymbols.PathRepository)
    private readonly pathRepository: PathVodRepository
  ) {}

  execute (url: UrlVo): IdVo {
    return this.pathRepository.getId(url)
  }
}
