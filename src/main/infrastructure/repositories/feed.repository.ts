import {injectable} from 'inversify'
import {ManifestVo} from '../../domain/valueObjects/manifest.vo'
import {IFeedRepository} from '../../domain/repository/feedRepository.interface'
import {EmptyFeedsException} from '../errors/emptyFeeds.exception'
import {PlaylistVo} from '../../domain/valueObjects/playlist.vo'

const m3u8Parser = require('m3u8-parser')

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

  private readonly getPlaylists = (manifest: ManifestVo) => {
    const parser = new m3u8Parser.Parser()
    parser.addParser({
      expression: /^#VOD-FRAMERATE/,
      customType: 'framerate'
    })

    parser.push(manifest.value)
    parser.end()

    return parser.manifest.playlists
  }
}
