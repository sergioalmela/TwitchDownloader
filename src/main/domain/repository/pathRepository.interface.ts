import {UrlVo} from '../valueObjects/url.vo'
import {IdVo} from '../valueObjects/id.vo'

export interface IPathRepository {
  getId: (url: UrlVo) => IdVo
}
