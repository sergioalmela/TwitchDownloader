import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import {IdVodVo} from '../../domain/valueObjects/idVod.vo'
import Credentials from "../../interfaces/Credentials";

@injectable()
export class AuthVodUseCase {
  constructor (
    @inject(ContainerSymbols.AuthRepository)
    private readonly authRepository: IAuthRepository
  ) {}

  async execute (id: IdVodVo): Promise<Credentials> {
    return await this.authRepository.getAuthVod(id)
  }
}
