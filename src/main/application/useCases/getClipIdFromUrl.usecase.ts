import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { IPathRepository } from '../../domain/repository/pathRepository.interface'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IdVo } from '../../domain/valueObjects/id.vo'

@injectable()
export class GetClipIdFromUrlUseCase {
  constructor (
    @inject(ContainerSymbols.PathRepository)
    private readonly pathRepository: IPathRepository
  ) {}

  execute (url: UrlVo): IdVo {
    return this.pathRepository.getId(url)
  }
}
