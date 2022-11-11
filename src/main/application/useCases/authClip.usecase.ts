import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import Credentials from '../../interfaces/Credentials'
import {Id} from '../../domain/valueObjects/id.vo'
import {AuthClipRepository} from '../../infrastructure/repositories/authClip.repository'

@injectable()
export class AuthClipUseCase {
  constructor (
    @inject(ContainerSymbols.AuthClipRepository)
    private readonly authRepository: AuthClipRepository
  ) {}

  async execute (id: Id): Promise<Credentials> {
    return await this.authRepository.auth(id)
  }
}
