import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import Credentials from '../../interfaces/Credentials'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { AuthVodRepository } from '../../infrastructure/repositories/authVod.repository'

@injectable()
export class AuthVodUseCase {
  constructor (
    @inject(ContainerSymbols.AuthVodRepository)
    private readonly authRepository: AuthVodRepository
  ) {}

  async execute (id: IdVo): Promise<Credentials> {
    return await this.authRepository.auth(id)
  }
}
