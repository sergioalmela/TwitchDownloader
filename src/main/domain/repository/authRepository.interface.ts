import Credentials from '../../interfaces/Credentials'
import {IdVo} from '../valueObjects/id.vo'

export interface IAuthRepository {
  auth: (id: IdVo) => Promise<Credentials>
}
