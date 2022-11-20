import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { IFileRepository } from '../../domain/repository/fileRepository.interface'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { UrlVo } from '../../domain/valueObjects/url.vo'

@injectable()
export class GetUrlsFromTxtFileUseCase {
  constructor (
    @inject(ContainerSymbols.FileRepository)
    private readonly fileRepository: IFileRepository
  ) {}

  execute (path: PathVo): UrlVo[] {
    return this.fileRepository.getUrls(path)
  }
}
