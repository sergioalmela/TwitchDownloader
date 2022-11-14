import {injectable} from 'inversify'
import {IPathRepository} from '../../domain/repository/pathRepository.interface'
import {FileVo} from '../../domain/valueObjects/file.vo'

@injectable()
export class PathRepository implements IPathRepository {
  getFileName (path: string): FileVo {
    // Return file name from system path
    return new FileVo(path.split('/').pop() || '')
  }
}
