import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {FileVo} from '../../domain/valueObjects/file.vo'
import {GetFileFromPathUseCase} from '../../application/useCases/getFileFromUrl.usecase'

@injectable()
export class FileController {
  constructor (
    @inject(ContainerSymbols.GetFileFromPathUseCase)
    private readonly getFileFromPathUseCase: GetFileFromPathUseCase
  ) {}

  getFileNameFromPath (path: string): FileVo {
    return this.getFileFromPathUseCase.execute(path)
  }
}
