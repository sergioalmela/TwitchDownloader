import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { IManifestRepository } from '../../domain/repository/manifestRepository.interface'
import { ManifestVo } from '../../domain/valueObjects/manifest.vo'
import Credentials from '../../infrastructure/types/Credential'
import { downloadLiveRetrySeconds } from '../../domain/constants/downloadOptions'

@injectable()
export class GetLiveManifestUseCase {
  constructor (
    @inject(ContainerSymbols.ManifestLiveRepository)
    private readonly manifestRepository: IManifestRepository
  ) {}

  async execute (id: IdVo, credentials: Credentials): Promise<ManifestVo> {
    let manifest

    manifest = await this.manifestRepository.getManifest(id, credentials)

    while (manifest.isEmpty() === true) {
      await new Promise(resolve => setTimeout(resolve, downloadLiveRetrySeconds * 1000))
      manifest = await this.manifestRepository.getManifest(id, credentials)
    }

    return manifest
  }
}
