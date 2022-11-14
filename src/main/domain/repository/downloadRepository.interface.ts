import {PathVo} from '../valueObjects/path.vo'
import {UrlVo} from '../valueObjects/url.vo'
import {FileVo} from '../valueObjects/file.vo'

export interface IDownloadRepository {
  download: (url: UrlVo, path: PathVo, file: FileVo) => Promise<any>
}
