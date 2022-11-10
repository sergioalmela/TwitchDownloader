import {IdClipVo} from '../valueObjects/idClip.vo'
import {IdVodVo} from '../valueObjects/idVod.vo'

export interface IAuthRepository {
  getAuthVod: (id: IdVodVo) => Promise<Credential>
  getAuthClip: (id: IdClipVo) => Promise<Credential>
}
