/** Symbols for repositories */
const Repositories = {
  AuthVodRepository: Symbol.for('AuthVodRepository'),
  AuthClipRepository: Symbol.for('AuthClipRepository'),
  PathRepository: Symbol.for('PathRepository'),
  ContentRepository: Symbol.for('ContentRepository')
}

const UseCases = {
  AuthVodUseCase: Symbol.for('AuthVodUseCase'),
  AuthClipUseCase: Symbol.for('AuthClipUseCase'),
  GetVodIdFromUrlUseCase: Symbol.for('GetVodIdFromUrlUseCase'),
  GetClipIdFromUrlUseCase: Symbol.for('GetClipIdFromUrlUseCase'),
  DetectContentTypeUseCase: Symbol.for('DetectContentTypeUseCase')
}

const Controllers = {
  AuthController: Symbol.for('AuthController'),
  DownloadController: Symbol.for('DownloadController')
}

const ContainerSymbols = {
  ...Repositories,
  ...UseCases,
  ...Controllers
}

export { ContainerSymbols }
