/** Symbols for repositories */
const Repositories = {
  AuthVodRepository: Symbol.for('AuthVodRepository'),
  AuthClipRepository: Symbol.for('AuthClipRepository'),
  ManifestVodRepository: Symbol.for('ManifestVodRepository'),
  ManifestClipRepository: Symbol.for('ManifestClipRepository'),
  PathRepository: Symbol.for('PathRepository'),
  ContentRepository: Symbol.for('ContentRepository'),
  ManifestRepository: Symbol.for('ManifestRepository'),
  FeedRepository: Symbol.for('FeedRepository')
}

const UseCases = {
  AuthVodUseCase: Symbol.for('AuthVodUseCase'),
  AuthClipUseCase: Symbol.for('AuthClipUseCase'),
  GetVodIdFromUrlUseCase: Symbol.for('GetVodIdFromUrlUseCase'),
  GetClipIdFromUrlUseCase: Symbol.for('GetClipIdFromUrlUseCase'),
  DetectContentTypeUseCase: Symbol.for('DetectContentTypeUseCase'),
  GetVodManifestUseCase: Symbol.for('GetVodManifestUseCase'),
  GetClipManifestUseCase: Symbol.for('GetClipManifestUseCase'),
  GetFeedFromManifestUseCase: Symbol.for('GetFeedFromManifestUseCase'),
  ParseFeedUseCase: Symbol.for('ParseFeedUseCase')
}

const Controllers = {
  AuthController: Symbol.for('AuthController'),
  DownloadController: Symbol.for('DownloadController'),
  FeedController: Symbol.for('FeedController')
}

const ContainerSymbols = {
  ...Repositories,
  ...UseCases,
  ...Controllers
}

export { ContainerSymbols }
