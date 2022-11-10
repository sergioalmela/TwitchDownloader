import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import {IdClipVo} from '../../domain/valueObjects/idClip.vo'

@injectable()
export class AuthClipUseCase {
  constructor (
    @inject(ContainerSymbols.AuthRepository)
    private readonly authRepository: IAuthRepository
  ) {}

  async execute (id: IdClipVo): Promise<Credential> {
    return await this.authRepository.getAuthClip(id)
  }
}
