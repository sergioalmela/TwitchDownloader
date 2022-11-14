import {UrlVo} from '../valueObjects/url.vo'
import {IdVo} from '../valueObjects/id.vo'

export interface IUrlRepository {
  getId: (url: UrlVo) => IdVo
}
