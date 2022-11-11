import {Container} from 'inversify'
import {ContainerSymbols} from './symbols'
import {AuthController} from './infrastructure/controllers/auth.controller'
import {AuthVodUseCase} from './application/useCases/authVod.usecase'
import {GetVodIdFromUrlUseCase} from './application/useCases/getVodIdFromUrl.usecase'
import {IAuthRepository} from './domain/repository/authRepository.interface'
import {ClipPathRepository} from './infrastructure/repositories/clipPath.repository'
import {IPathRepository} from './domain/repository/pathRepository.interface'
import {AuthClipUseCase} from './application/useCases/authClip.usecase'
import {GetClipIdFromUrlUseCase} from './application/useCases/getClipIdFromUrl.usecase'
import {DownloaderController} from './infrastructure/controllers/downloader.controller'
import {DetectContentTypeUseCase} from './application/useCases/detectContentType.usecase'
import {ContentRepository} from './infrastructure/repositories/content.repository'
import {AuthClipRepository} from './infrastructure/repositories/authClip.repository'
import {AuthVodRepository} from './infrastructure/repositories/authVod.repository'

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
  .to(ClipPathRepository)

container
  .bind<ContentRepository>(ContainerSymbols.ContentRepository)
  .to(ContentRepository)

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

// #endregion

// #region Controllers

container
  .bind<AuthController>(ContainerSymbols.AuthController)
  .to(AuthController)

container
  .bind<DownloaderController>(ContainerSymbols.DownloadController)
  .to(DownloaderController)

// #endregion

export default container
