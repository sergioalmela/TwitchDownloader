import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {AuthVodUseCase} from '../../application/useCases/authVod.usecase'
import {IdVodVo} from '../../domain/valueObjects/idVod.vo'
import {GetVodIdFromUrlUseCase} from '../../application/useCases/getVodIdFromUrl.usecase'
import {IdClipVo} from '../../domain/valueObjects/idClip.vo'
import {AuthClipUseCase} from '../../application/useCases/authClip.usecase'
import {GetClipIdFromUrlUseCase} from '../../application/useCases/getClipIdFromUrl.usecase'
import Credentials from "../../interfaces/Credentials";

@injectable()
export class AuthController {
  constructor (
    @inject(ContainerSymbols.AuthVodUseCase)
    private readonly authVodUseCase: AuthVodUseCase,
    @inject(ContainerSymbols.AuthClipUseCase)
    private readonly authClipUseCase: AuthClipUseCase,
    @inject(ContainerSymbols.GetVodIdFromUrlUseCase)
    private readonly getVodIdFromUrl: GetVodIdFromUrlUseCase,
    @inject(ContainerSymbols.GetClipIdFromUrlUseCase)
    private readonly getClipIdFromUrl: GetClipIdFromUrlUseCase
  ) {}

  async getVodCredentials (url: string): Promise<Credentials> {
    const id: IdVodVo = this.getVodIdFromUrl.execute(url)

    return await this.authVodUseCase.execute(id)
  }

  async getClipCredentials (url: string): Promise<Credentials> {
    const id: IdClipVo = this.getClipIdFromUrl.execute(url)

    return await this.authClipUseCase.execute(id)
  }
}
