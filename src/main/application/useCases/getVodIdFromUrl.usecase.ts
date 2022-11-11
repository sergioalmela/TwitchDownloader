import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import {IdVodVo} from '../../domain/valueObjects/idVod.vo'
import {PathRepository} from '../../infrastructure/repositories/path.repository'
import {UrlVo} from "../../domain/valueObjects/url.vo";

@injectable()
export class GetVodIdFromUrlUseCase {
  constructor (
    @inject(ContainerSymbols.AuthRepository)
    private readonly authRepository: IAuthRepository,
    @inject(ContainerSymbols.PathRepository)
    private readonly pathRepository: PathRepository
  ) {}

  execute (url: UrlVo): IdVodVo {
    return this.pathRepository.getVodId(url)
  }
}
