import {IdClipVo} from '../valueObjects/idClip.vo'
import {IdVodVo} from '../valueObjects/idVod.vo'

export class AuthModel {
  constructor (
    public readonly id: IdClipVo | IdVodVo
  ) {}
}
