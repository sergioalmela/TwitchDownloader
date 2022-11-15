import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { IPathRepository } from '../../domain/repository/pathRepository.interface'
import { FileVo } from '../../domain/valueObjects/file.vo'
import {PathVo} from "../../domain/valueObjects/path.vo";

@injectable()
export class GetFileFromPathUseCase {
  constructor (
    @inject(ContainerSymbols.PathRepository)
    private readonly pathRepository: IPathRepository
  ) {}

  execute (path: PathVo): FileVo {
    return this.pathRepository.getFileName(path)
  }
}
