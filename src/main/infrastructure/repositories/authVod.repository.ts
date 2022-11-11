import {injectable} from 'inversify'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import axios from 'axios'
import Credentials from '../../interfaces/Credentials'
import {IdVo} from '../../domain/valueObjects/id.vo'
import {authHeaders} from '../../domain/constants/authHeaders'

@injectable()
export class AuthVodRepository implements IAuthRepository {
  async auth (id: IdVo): Promise<Credentials> {
    const authConfigVod: object = {
      operationName: 'PlaybackAccessToken',
      variables: {
        isLive: false,
        login: '',
        isVod: true,
        vodID: id.value.toString(),
        playerType: 'site'
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: '0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712'
        }
      }
    }

    const data = await axios.post('https://gql.twitch.tv/gql', authConfigVod, authHeaders())

    return data.data.data.videoPlaybackAccessToken
  }
}
