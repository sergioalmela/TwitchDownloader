import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { IdVo } from '../../domain/valueObjects/id.vo'
import Credentials from '../../infrastructure/types/Credential'
import { AuthLiveRepository } from '../../infrastructure/repositories/authLive.repository'

@injectable()
export class AuthLiveUseCase {
  constructor (
    @inject(ContainerSymbols.AuthLiveRepository)
    private readonly authRepository: AuthLiveRepository
  ) {}

  async execute (id: IdVo): Promise<Credentials> {
    return await this.authRepository.auth(id)
  }
}
