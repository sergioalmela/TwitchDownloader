import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { IManifestRepository } from '../../domain/repository/manifestRepository.interface'
import { ManifestVo } from '../../domain/valueObjects/manifest.vo'
import Credentials from '../../interfaces/Credentials'

@injectable()
export class GetVodManifestUseCase {
  constructor (
    @inject(ContainerSymbols.ManifestVodRepository)
    private readonly manifestRepository: IManifestRepository
  ) {}

  async execute (id: IdVo, credentials: Credentials): Promise<ManifestVo> {
    return await this.manifestRepository.getManifest(id, credentials)
  }
}
