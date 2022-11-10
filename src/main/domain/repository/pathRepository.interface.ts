import {IdVodVo} from '../valueObjects/idVod.vo'
import {IdClipVo} from '../valueObjects/idClip.vo'

export interface IPathRepository {
  getVodId: (url: string) => IdVodVo
  getClipId: (url: string) => IdClipVo
}
