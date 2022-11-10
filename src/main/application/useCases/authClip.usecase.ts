import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import {IdClipVo} from '../../domain/valueObjects/idClip.vo'
import Credentials from "../../interfaces/Credentials";

@injectable()
export class AuthClipUseCase {
  constructor (
    @inject(ContainerSymbols.AuthRepository)
    private readonly authRepository: IAuthRepository
  ) {}

  async execute (id: IdClipVo): Promise<Credentials> {
    return await this.authRepository.getAuthClip(id)
  }
}
