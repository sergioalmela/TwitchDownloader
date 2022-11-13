import { PathVo } from '../valueObjects/path.vo'
import { UrlVo } from '../valueObjects/url.vo'

export interface IDownloadRepository {
  download: (url: UrlVo, path: PathVo) => Promise<any>
}
