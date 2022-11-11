import {IdVodVo} from '../valueObjects/idVod.vo'
import {IdClipVo} from '../valueObjects/idClip.vo'
import {UrlVo} from "../valueObjects/url.vo";

export interface IPathRepository {
  getVodId: (url: UrlVo) => IdVodVo
  getClipId: (url: UrlVo) => IdClipVo
}
