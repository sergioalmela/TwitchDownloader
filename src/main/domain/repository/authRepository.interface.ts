import Credentials from '../../interfaces/Credentials'
import {Id} from '../valueObjects/id.vo'

export interface IAuthRepository {
  auth: (id: Id) => Promise<Credentials>
}
