import {injectable} from 'inversify'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import axios from 'axios'
import Credentials from '../../interfaces/Credentials'
import {IdVo} from '../../domain/valueObjects/id.vo'
import {authHeaders} from '../../domain/constants/authHeaders'

@injectable()
export class AuthClipRepository implements IAuthRepository {
  async auth (id: IdVo): Promise<Credentials> {
    const authConfigClip: object = {
      operationName: 'VideoAccessToken_Clip',
      variables: {
        slug: id.value.toString()
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: '36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11'
        }
      }
    }

    const data = await axios.post('https://gql.twitch.tv/gql', authConfigClip, authHeaders())

    return data.data.data.clip.playbackAccessToken
  }
}
