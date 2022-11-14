import {FileVo} from '../valueObjects/file.vo'

export interface IPathRepository {
  getFileName: (path: string) => FileVo
}
