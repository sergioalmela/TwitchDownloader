import { injectable } from 'inversify'
import { IAuthRepository } from '../../domain/repository/authRepository.interface'
import axios from 'axios'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { authHeaders } from '../../domain/constants/authHeaders'
import Credentials from '../types/Credential'
import { authConfigLive } from '../../domain/constants/authConfigLive'

@injectable()
export class AuthLiveRepository implements IAuthRepository {
  async auth (id: IdVo): Promise<Credentials> {
    const data = await axios.post('https://gql.twitch.tv/gql', authConfigLive(id), authHeaders())

    return data.data.data.streamPlaybackAccessToken
  }
}
