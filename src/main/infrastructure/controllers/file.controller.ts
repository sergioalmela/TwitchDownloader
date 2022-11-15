import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { FileVo } from '../../domain/valueObjects/file.vo'
import { GetFileFromPathUseCase } from '../../application/useCases/getFileFromPath.usecase'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'
import { PlaylistVo } from '../../domain/valueObjects/playlist.vo'
import { GetExtensionFromPlaylistUseCase } from '../../application/useCases/getExtensionFromPlaylist.usecase'
import {PathVo} from "../../domain/valueObjects/path.vo";

@injectable()
export class FileController {
  constructor (
    @inject(ContainerSymbols.GetFileFromPathUseCase)
    private readonly getFileFromPathUseCase: GetFileFromPathUseCase,
    @inject(ContainerSymbols.GetExtensionFromPlaylistUseCase)
    private readonly getExtensionFromPlaylistUseCase: GetExtensionFromPlaylistUseCase
  ) {}

  getFileNameFromPath (path: PathVo): FileVo {
    return this.getFileFromPathUseCase.execute(path)
  }

  getExtensionFromPlaylist (playlist: PlaylistVo): ExtensionVo {
    return this.getExtensionFromPlaylistUseCase.execute(playlist)
  }
}
