import {ManifestVo} from '../valueObjects/manifest.vo'
import Credentials from '../../interfaces/Credentials'
import {Id} from '../valueObjects/id.vo'

export interface IFeedRepository {
  getVodManifest: (id: Id, credentials: Credentials) => Promise<ManifestVo>
}
