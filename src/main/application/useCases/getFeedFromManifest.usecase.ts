import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {IFeedRepository} from '../../domain/repository/feedRepository.interface'
import {ManifestVo} from '../../domain/valueObjects/manifest.vo'
import {PlaylistVo} from '../../domain/valueObjects/playlist.vo'

@injectable()
export class GetFeedFromManifestUseCase {
  constructor (
    @inject(ContainerSymbols.FeedRepository)
    private readonly feedRepository: IFeedRepository
  ) {}

  execute (manifest: ManifestVo): PlaylistVo[] {
    return this.feedRepository.getFeed(manifest)
  }
}
