import {ManifestVo} from '../valueObjects/manifest.vo'
import {PlaylistVo} from '../valueObjects/playlist.vo'

export interface IFeedRepository {
  getFeed: (manifest: ManifestVo) => PlaylistVo[]
}
