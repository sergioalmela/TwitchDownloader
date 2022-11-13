import { inject, injectable } from 'inversify'
import { ContainerSymbols } from '../../symbols'
import { AuthVodUseCase } from '../../application/useCases/authVod.usecase'
import { GetVodIdFromUrlUseCase } from '../../application/useCases/getVodIdFromUrl.usecase'
import { AuthClipUseCase } from '../../application/useCases/authClip.usecase'
import { GetClipIdFromUrlUseCase } from '../../application/useCases/getClipIdFromUrl.usecase'
import Credentials from '../../interfaces/Credentials'
import { DetectContentTypeUseCase } from '../../application/useCases/detectContentType.usecase'
import { ContentTypes } from '../../domain/constants/contentTypes.enum'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { ManifestVo } from '../../domain/valueObjects/manifest.vo'
import { GetVodManifestUseCase } from '../../application/useCases/getVodManifest.usecase'
import { GetFeedFromManifestUseCase } from '../../application/useCases/getFeedFromManifest.usecase'
import { PlaylistVo } from '../../domain/valueObjects/playlist.vo'
import { FeedVo } from '../../domain/valueObjects/feed.vo'
import { ParseFeedUseCase } from '../../application/useCases/parseFeed.usecase'
import { InvalidUrlException } from '../errors/invalidUrl.exception'

@injectable()
export class FeedController {
  constructor (
    @inject(ContainerSymbols.AuthVodUseCase)
    private readonly authVodUseCase: AuthVodUseCase,
    @inject(ContainerSymbols.AuthClipUseCase)
    private readonly authClipUseCase: AuthClipUseCase,
    @inject(ContainerSymbols.GetVodIdFromUrlUseCase)
    private readonly getVodIdFromUrlUseCase: GetVodIdFromUrlUseCase,
    @inject(ContainerSymbols.GetClipIdFromUrlUseCase)
    private readonly getClipIdFromUrl: GetClipIdFromUrlUseCase,
    @inject(ContainerSymbols.DetectContentTypeUseCase)
    private readonly detectContentTypeUseCase: DetectContentTypeUseCase,
    @inject(ContainerSymbols.GetVodManifestUseCase)
    private readonly getVodManifestUseCase: GetVodManifestUseCase,
    @inject(ContainerSymbols.GetFeedFromManifestUseCase)
    private readonly getFeedFromManifestUseCase: GetFeedFromManifestUseCase,
    @inject(ContainerSymbols.ParseFeedUseCase)
    private readonly parseFeedUseCase: ParseFeedUseCase
  ) {}

  async getFeeds (url: UrlVo): Promise<PlaylistVo[]> {
    const type: ContentTypes = this.detectContentTypeUseCase.execute(url)

    if (type === ContentTypes.VOD) {
      const id: IdVo = this.getVodIdFromUrlUseCase.execute(url)

      const credentials: Credentials = await this.authVodUseCase.execute(id)

      const manifest: ManifestVo = await this.getVodManifestUseCase.execute(id, credentials)

      return this.getFeedFromManifestUseCase.execute(manifest)
    } else if (type === ContentTypes.CLIP) {
      // TODO: Add clip logic
    } else {
      throw new InvalidUrlException()
    }
  }

  parseFeeds (playlists: PlaylistVo[]): FeedVo[] {
    return this.parseFeedUseCase.execute(playlists)
  }
}
