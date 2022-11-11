import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import {IPathRepository} from '../../domain/repository/pathRepository.interface'
import {UrlVo} from '../../domain/valueObjects/url.vo'
import {Id} from '../../domain/valueObjects/id.vo'

@injectable()
export class GetClipIdFromUrlUseCase {
  constructor (
    @inject(ContainerSymbols.AuthClipRepository)
    private readonly authRepository: IAuthRepository,
    @inject(ContainerSymbols.PathRepository)
    private readonly pathRepository: IPathRepository
  ) {}

  execute (url: UrlVo): Id {
    return this.pathRepository.getId(url)
  }
}
