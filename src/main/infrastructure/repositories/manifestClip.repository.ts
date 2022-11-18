import { injectable } from 'inversify'
import { ManifestVo } from '../../domain/valueObjects/manifest.vo'
import axios from 'axios'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { IManifestRepository } from '../../domain/repository/manifestRepository.interface'
import Credentials from '../types/Credential'
import { authHeaders } from '../../domain/constants/authHeaders'
import { authConfigClip } from '../../domain/constants/authConfigClip'
import { QualityVo } from '../../domain/valueObjects/quality.vo'
import Quality from '../types/Quality'
import { manifestComplete } from '../../domain/constants/manifest'

@injectable()
export class ManifestClipRepository implements IManifestRepository {
  async getManifest (id: IdVo, credentials: Credentials): Promise<ManifestVo> {
    // TODO: Maybe we can do the same as manifestLiveRepository to fetch the manifest and avoid doing it manually
    const data = await axios.post('https://gql.twitch.tv/gql', authConfigClip(id), authHeaders())
    const qualities: object[] = data.data.data.clip.videoQualities

    const qualitiesVo: QualityVo[] = qualities.map((quality: Quality) => {
      const _quality = new QualityVo(quality)
      _quality.setQualityString()

      return _quality
    })

    return new ManifestVo(manifestComplete(qualitiesVo, credentials))
  }
}
