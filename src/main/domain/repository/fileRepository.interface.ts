import { PathVo } from '../valueObjects/path.vo'
import { UrlVo } from '../valueObjects/url.vo'

export interface IFileRepository {
  getUrls: (path: PathVo) => UrlVo[]
}
