import Credentials from '../../interfaces/Credentials'
import { IdVo } from '../valueObjects/id.vo'
import { ManifestVo } from '../valueObjects/manifest.vo'

export interface IManifestRepository {
  getManifest: (id: IdVo, credentials: Credentials) => Promise<ManifestVo>
}
