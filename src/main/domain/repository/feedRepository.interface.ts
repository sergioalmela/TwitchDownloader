import { ManifestVo } from '../valueObjects/manifest.vo'
import Credentials from '../../interfaces/Credentials'
import { IdVo } from '../valueObjects/id.vo'

export interface IFeedRepository {
  getVodManifest: (id: IdVo, credentials: Credentials) => Promise<ManifestVo>
}
