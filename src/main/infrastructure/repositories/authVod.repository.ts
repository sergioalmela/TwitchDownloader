import { injectable } from 'inversify'
import { IAuthRepository } from '../../domain/repository/authRepository.interface'
import axios from 'axios'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { authHeaders } from '../../domain/constants/authHeaders'
import Credentials from '../types/Credential'
import { authConfigVod } from '../../domain/constants/authConfigVod'

@injectable()
export class AuthVodRepository implements IAuthRepository {
  async auth (id: IdVo): Promise<Credentials> {
    const data = await axios.post('https://gql.twitch.tv/gql', authConfigVod(id), authHeaders())

    return data.data.data.videoPlaybackAccessToken
  }
}
