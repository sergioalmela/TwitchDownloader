import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {IFeedRepository} from '../../domain/repository/feedRepository.interface'
import {PlaylistVo} from '../../domain/valueObjects/playlist.vo'
import {FeedVo} from '../../domain/valueObjects/feed.vo'

@injectable()
export class ParseFeedUseCase {
  constructor (
    @inject(ContainerSymbols.FeedRepository)
    private readonly feedRepository: IFeedRepository
  ) {}

  execute (playlists: PlaylistVo[]): FeedVo[] {
    return this.feedRepository.parseFeed(playlists)
  }
}
