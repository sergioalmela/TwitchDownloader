import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { IPathRepository } from '../../domain/repository/pathRepository.interface'
import { PlaylistVo } from '../../domain/valueObjects/playlist.vo'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'

@injectable()
export class GetExtensionFromPlaylistUseCase {
  constructor (
    @inject(ContainerSymbols.PathRepository)
    private readonly pathRepository: IPathRepository
  ) {}

  execute (playlist: PlaylistVo): ExtensionVo {
    return this.pathRepository.getExtension(playlist)
  }
}
