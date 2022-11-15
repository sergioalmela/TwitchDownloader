import { IdVo } from '../valueObjects/id.vo'
import Credentials from '../../infrastructure/types/Credential'

export interface IAuthRepository {
  auth: (id: IdVo) => Promise<Credentials>
}
