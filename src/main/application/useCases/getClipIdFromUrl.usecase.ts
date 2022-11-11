import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import {IPathRepository} from '../../domain/repository/pathRepository.interface'
import {IdClipVo} from '../../domain/valueObjects/idClip.vo'
import {UrlVo} from "../../domain/valueObjects/url.vo";

@injectable()
export class GetClipIdFromUrlUseCase {
  constructor (
    @inject(ContainerSymbols.AuthRepository)
    private readonly authRepository: IAuthRepository,
    @inject(ContainerSymbols.PathRepository)
    private readonly pathRepository: IPathRepository
  ) {}

  execute (url: UrlVo): IdClipVo {
    return this.pathRepository.getClipId(url)
  }
}
