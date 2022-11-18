import { injectable } from 'inversify'
import { ManifestVo } from '../../domain/valueObjects/manifest.vo'
import { IFeedRepository } from '../../domain/repository/feedRepository.interface'
import { EmptyFeedsException } from '../errors/emptyFeeds.exception'
import { PlaylistVo } from '../../domain/valueObjects/playlist.vo'
import { FeedVo } from '../../domain/valueObjects/feed.vo'
import * as m3u8Parser from 'm3u8-parser'

@injectable()
export class FeedRepository implements IFeedRepository {
  getFeed (manifest: ManifestVo): PlaylistVo[] {
    const playlists: any[] = this.getPlaylists(manifest)

    // If empty playlists, throw error
    if (playlists.length === 0) {
      throw new EmptyFeedsException()
    }

    return playlists.map((playlist): PlaylistVo => {
      const feed = new PlaylistVo({
        video: playlist.attributes.VIDEO,
        quality: playlist.attributes.RESOLUTION,
        url: playlist.uri,
        framerate: playlist.attributes['FRAME-RATE'],
        bandwidth: playlist.attributes.BANDWIDTH,
        codecs: playlist.attributes.CODECS
      })
      feed.setVideo(playlist.attributes.VIDEO)

      return feed
    })
  }

  parseFeed = (playlists: PlaylistVo[]): FeedVo[] => {
    return playlists.map((playlist: PlaylistVo, index: number): FeedVo => {
      return new FeedVo({
        title: playlist.value.video === 'chunked' ? 'Original' : playlist.value.video,
        value: index
      })
    })
  }

  private readonly getPlaylists = (manifest: ManifestVo): any[] => {
    const parser = new m3u8Parser.Parser()

    parser.push(manifest.value)
    parser.end()

    return parser.manifest.playlists
  }
}
