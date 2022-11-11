import {UrlVo} from '../valueObjects/url.vo'
import {Id} from '../valueObjects/id.vo'

export interface IPathRepository {
  getId: (url: UrlVo) => Id
}
