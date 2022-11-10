import {injectable} from 'inversify'
import {IAuthRepository} from '../../domain/repository/authRepository.interface'
import {IdClipVo} from '../../domain/valueObjects/idClip.vo'
import {IdVodVo} from '../../domain/valueObjects/idVod.vo'
import axios from 'axios'

@injectable()
export class AuthRepository implements IAuthRepository {
  async getAuthVod (id: IdVodVo): Promise<Credential> {
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

    const data = await axios.post('https://gql.twitch.tv/gql', authConfigVod, this.getHeaders())

    return data.data.data.videoPlaybackAccessToken
  }

  async getAuthClip (id: IdClipVo): Promise<Credential> {
    const authConfigClip: object = {
      operationName: 'VideoAccessToken_Clip',
      variables: {
        slug: 'CogentBitterPartridgeMikeHogu-8j5AAzneEfHAOELt'
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: '36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11'
        }
      }
    }

    const data = await axios.post('https://gql.twitch.tv/gql', authConfigClip, this.getHeaders())

    return data.data.videoPlaybackAccessToken
  }

  private getHeaders (): object {
    return {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
      }
    }
  }
}
