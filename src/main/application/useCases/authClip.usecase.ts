import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { AuthClipRepository } from '../../infrastructure/repositories/authClip.repository'
import Credentials from '../../infrastructure/types/Credential'

@injectable()
export class AuthClipUseCase {
  constructor (
    @inject(ContainerSymbols.AuthClipRepository)
    private readonly authRepository: AuthClipRepository
  ) {}

  async execute (id: IdVo): Promise<Credentials> {
    return await this.authRepository.auth(id)
  }
}
