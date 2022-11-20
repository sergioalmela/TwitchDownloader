import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { FileVo } from '../../domain/valueObjects/file.vo'
import { GetFileFromPathUseCase } from '../../application/useCases/getFileFromPath.usecase'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'
import { PlaylistVo } from '../../domain/valueObjects/playlist.vo'
import { GetExtensionFromPlaylistUseCase } from '../../application/useCases/getExtensionFromPlaylist.usecase'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { GetUrlsFromTxtFileUseCase } from '../../application/useCases/getUrlsFromTxtFile.usecase'

@injectable()
export class FileController {
  constructor (
    @inject(ContainerSymbols.GetFileFromPathUseCase)
    private readonly getFileFromPathUseCase: GetFileFromPathUseCase,
    @inject(ContainerSymbols.GetExtensionFromPlaylistUseCase)
    private readonly getExtensionFromPlaylistUseCase: GetExtensionFromPlaylistUseCase,
    @inject(ContainerSymbols.GetUrlsFromTxtFileUseCase)
    private readonly getUrlsFromTxtFileUseCase: GetUrlsFromTxtFileUseCase
  ) {}

  getFileNameFromPath (path: PathVo): FileVo {
    return this.getFileFromPathUseCase.execute(path)
  }

  getExtensionFromPlaylist (playlist: PlaylistVo): ExtensionVo {
    return this.getExtensionFromPlaylistUseCase.execute(playlist)
  }

  getUrlsFromFile (path: PathVo): UrlVo[] {
    return this.getUrlsFromTxtFileUseCase.execute(path)
  }
}
