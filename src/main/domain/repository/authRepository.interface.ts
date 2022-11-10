import {IdClipVo} from '../valueObjects/idClip.vo'
import {IdVodVo} from '../valueObjects/idVod.vo'
import Credentials from "../../interfaces/Credentials";

export interface IAuthRepository {
  getAuthVod: (id: IdVodVo) => Promise<Credentials>
  getAuthClip: (id: IdClipVo) => Promise<Credentials>
}
