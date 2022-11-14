/** Symbols for repositories */
const Repositories = {
  AuthVodRepository: Symbol.for('AuthVodRepository'),
  AuthClipRepository: Symbol.for('AuthClipRepository'),
  UrlClipRepository: Symbol.for('UrlClipRepository'),
  UrlVodRepository: Symbol.for('UrlVodRepository'),
  ManifestVodRepository: Symbol.for('ManifestVodRepository'),
  ManifestClipRepository: Symbol.for('ManifestClipRepository'),
  PathRepository: Symbol.for('PathRepository'),
  ContentRepository: Symbol.for('ContentRepository'),
  ManifestRepository: Symbol.for('ManifestRepository'),
  FeedRepository: Symbol.for('FeedRepository'),
  DownloadRepository: Symbol.for('DownloadRepository')
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
  ParseFeedUseCase: Symbol.for('ParseFeedUseCase'),
  DownloadFromFeedUseCase: Symbol.for('DownloadFromFeedUseCase'),
  GetFileFromPathUseCase: Symbol.for('GetFileFromPathUseCase'),
  GetExtensionFromPlaylistUseCase: Symbol.for('GetExtensionFromPlaylistUseCase')
}

const Controllers = {
  DownloadController: Symbol.for('DownloadController'),
  FeedController: Symbol.for('FeedController'),
  FileController: Symbol.for('FileController')
}

const ContainerSymbols = {
  ...Repositories,
  ...UseCases,
  ...Controllers
}

export { ContainerSymbols }
