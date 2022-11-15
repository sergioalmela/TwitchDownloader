import { injectable } from 'inversify'
import { ManifestVo } from '../../domain/valueObjects/manifest.vo'
import axios from 'axios'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { IManifestRepository } from '../../domain/repository/manifestRepository.interface'
import Credentials from '../types/Credential'

@injectable()
export class ManifestClipRepository implements IManifestRepository {
  async getManifest (id: IdVo, credentials: Credentials): Promise<ManifestVo> {
    return await axios.get(`https://usher.ttvnw.net/vod/${id.value}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)
  }
}
