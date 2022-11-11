import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import {UrlVo} from '../../domain/valueObjects/url.vo'
import {VodPathRepository} from '../../infrastructure/repositories/vodPath.repository'
import {Id} from '../../domain/valueObjects/id.vo'

@injectable()
export class GetVodIdFromUrlUseCase {
  constructor (
    @inject(ContainerSymbols.AuthVodRepository)
    private readonly authRepository: IAuthRepository,
    @inject(ContainerSymbols.PathRepository)
    private readonly pathRepository: VodPathRepository
  ) {}

  execute (url: UrlVo): Id {
    return this.pathRepository.getId(url)
  }
}
