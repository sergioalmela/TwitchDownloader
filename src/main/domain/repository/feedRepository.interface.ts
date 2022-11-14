import {ManifestVo} from '../valueObjects/manifest.vo'
import {PlaylistVo} from '../valueObjects/playlist.vo'
import {FeedVo} from '../valueObjects/feed.vo'

export interface IFeedRepository {
  getFeed: (manifest: ManifestVo) => PlaylistVo[]
  parseFeed: (playlists: PlaylistVo[]) => FeedVo[]
}
