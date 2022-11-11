import {injectable} from 'inversify'
import {ManifestVo} from '../../domain/valueObjects/manifest.vo'
import axios from 'axios'
import Credentials from '../../interfaces/Credentials'
import {IdVo} from '../../domain/valueObjects/id.vo'
import {IManifestRepository} from '../../domain/repository/manifestRepository.interface'

@injectable()
export class ManifestVodRepository implements IManifestRepository {
  async getManifest (id: IdVo, credentials: Credentials): Promise<ManifestVo> {
    const response = await axios.get(`https://usher.ttvnw.net/vod/${id.value}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)
    return new ManifestVo(response.data)
  }
}
