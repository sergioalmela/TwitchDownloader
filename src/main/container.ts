import {Container} from 'inversify'
import {ContainerSymbols} from './symbols'
import {AuthController} from './infrastructure/controllers/auth.controller'
import {AuthVodUseCase} from './application/useCases/authVod.usecase'
import {GetVodIdFromUrlUseCase} from './application/useCases/getVodIdFromUrl.usecase'
import {IAuthRepository} from './domain/repository/authRepository.interface'
import {AuthRepository} from './infrastructure/repositories/auth.repository'
import {PathRepository} from './infrastructure/repositories/path.repository'
import {IPathRepository} from './domain/repository/pathRepository.interface'
import {AuthClipUseCase} from './application/useCases/authClip.usecase'
import {GetClipIdFromUrlUseCase} from "./application/useCases/getClipIdFromUrl.usecase";

const container = new Container()

// #region Repositories

container
  .bind<IAuthRepository>(ContainerSymbols.AuthRepository)
  .to(AuthRepository)

container
  .bind<IPathRepository>(ContainerSymbols.PathRepository)
  .to(PathRepository)

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

// #endregion

// #region Controllers

container
  .bind<AuthController>(ContainerSymbols.AuthController)
  .to(AuthController)

// #endregion

export default container
