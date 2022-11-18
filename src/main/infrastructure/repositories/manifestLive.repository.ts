import { injectable } from 'inversify'
import { ManifestVo } from '../../domain/valueObjects/manifest.vo'
import axios from 'axios'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { IManifestRepository } from '../../domain/repository/manifestRepository.interface'
import Credentials from '../types/Credential'
import { FetchFeedErrorException } from '../errors/fetchFeedError.exception'

@injectable()
export class ManifestLiveRepository implements IManifestRepository {
  async getManifest (id: IdVo, credentials: Credentials): Promise<ManifestVo> {
    let response = ''
    try {
      const result = await axios.get(`https://usher.ttvnw.net/api/channel/hls/${id.value}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)
      response = result.data
    } catch (error) {
      console.log(error)
      throw new FetchFeedErrorException()
    }

    return new ManifestVo(response)
  }
}
