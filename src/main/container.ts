import { Container } from 'inversify'
import { ContainerSymbols } from './symbols'
import { AuthVodUseCase } from './application/useCases/authVod.usecase'
import { GetVodIdFromUrlUseCase } from './application/useCases/getVodIdFromUrl.usecase'
import { IAuthRepository } from './domain/repository/authRepository.interface'
import { PathClipRepository } from './infrastructure/repositories/pathClip.repository'
import { IPathRepository } from './domain/repository/pathRepository.interface'
import { AuthClipUseCase } from './application/useCases/authClip.usecase'
import { GetClipIdFromUrlUseCase } from './application/useCases/getClipIdFromUrl.usecase'
import { FeedController } from './infrastructure/controllers/feed.controller'
import { DetectContentTypeUseCase } from './application/useCases/detectContentType.usecase'
import { ContentRepository } from './infrastructure/repositories/content.repository'
import { AuthClipRepository } from './infrastructure/repositories/authClip.repository'
import { AuthVodRepository } from './infrastructure/repositories/authVod.repository'
import { IManifestRepository } from './domain/repository/manifestRepository.interface'
import { ManifestVodRepository } from './infrastructure/repositories/manifestVod.repository'
import { ManifestClipRepository } from './infrastructure/repositories/manifestClip.repository'
import { GetVodManifestUseCase } from './application/useCases/getVodManifest.usecase'
import { GetClipManifestUseCase } from './application/useCases/getClipManifest.usecase'
import { GetFeedFromManifestUseCase } from './application/useCases/getFeedFromManifest.usecase'
import { IFeedRepository } from './domain/repository/feedRepository.interface'
import { FeedRepository } from './infrastructure/repositories/feed.repository'
import { ParseFeedUseCase } from './application/useCases/parseFeed.usecase'

const container = new Container()

// #region Repositories

container
  .bind<IAuthRepository>(ContainerSymbols.AuthVodRepository)
  .to(AuthVodRepository)

container
  .bind<IAuthRepository>(ContainerSymbols.AuthClipRepository)
  .to(AuthClipRepository)

container
  .bind<IPathRepository>(ContainerSymbols.PathRepository)
  .to(PathClipRepository)

container
  .bind<IFeedRepository>(ContainerSymbols.FeedRepository)
  .to(FeedRepository)

container
  .bind<ContentRepository>(ContainerSymbols.ContentRepository)
  .to(ContentRepository)

container
  .bind<IManifestRepository>(ContainerSymbols.ManifestVodRepository)
  .to(ManifestVodRepository)

container
  .bind<IManifestRepository>(ContainerSymbols.ManifestClipRepository)
  .to(ManifestClipRepository)

// #endregion

// #region Use cases

container
  .bind<AuthVodUseCase>(ContainerSymbols.AuthVodUseCase)
  .to(AuthVodUseCase)

container
  .bind<AuthClipUseCase>(ContainerSymbols.AuthClipUseCase)
  .to(AuthClipUseCase)

container
  .bind<GetVodIdFromUrlUseCase>(ContainerSymbols.GetVodIdFromUrlUseCase)
  .to(GetVodIdFromUrlUseCase)

container
  .bind<GetClipIdFromUrlUseCase>(ContainerSymbols.GetClipIdFromUrlUseCase)
  .to(GetClipIdFromUrlUseCase)

container
  .bind<DetectContentTypeUseCase>(ContainerSymbols.DetectContentTypeUseCase)
  .to(DetectContentTypeUseCase)

container
  .bind<GetVodManifestUseCase>(ContainerSymbols.GetVodManifestUseCase)
  .to(GetVodManifestUseCase)

container
  .bind<GetClipManifestUseCase>(ContainerSymbols.GetClipManifestUseCase)
  .to(GetClipManifestUseCase)

container
  .bind<GetFeedFromManifestUseCase>(ContainerSymbols.GetFeedFromManifestUseCase)
  .to(GetFeedFromManifestUseCase)

container
  .bind<ParseFeedUseCase>(ContainerSymbols.ParseFeedUseCase)
  .to(ParseFeedUseCase)

// #endregion

// #region Controllers

/* container
  .bind<FeedController>(ContainerSymbols.DownloadController)
  .to(FeedController) */

container
  .bind<FeedController>(ContainerSymbols.FeedController)
  .to(FeedController)

// #endregion

export default container
