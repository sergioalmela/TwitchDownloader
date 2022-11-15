import { IdVo } from '../valueObjects/id.vo'
import { ManifestVo } from '../valueObjects/manifest.vo'
import Credentials from '../../infrastructure/types/Credential'

export interface IManifestRepository {
  getManifest: (id: IdVo, credentials: Credentials) => Promise<ManifestVo>
}
