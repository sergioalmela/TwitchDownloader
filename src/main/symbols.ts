/** Symbols for repositories */
const Repositories = {
  AuthVodRepository: Symbol.for('AuthVodRepository'),
  AuthClipRepository: Symbol.for('AuthClipRepository'),
  AuthLiveRepository: Symbol.for('AuthLiveRepository'),
  UrlClipRepository: Symbol.for('UrlClipRepository'),
  UrlLiveRepository: Symbol.for('UrlLiveRepository'),
  UrlVodRepository: Symbol.for('UrlVodRepository'),
  ManifestVodRepository: Symbol.for('ManifestVodRepository'),
  ManifestClipRepository: Symbol.for('ManifestClipRepository'),
  ManifestLiveRepository: Symbol.for('ManifestLiveRepository'),
  PathRepository: Symbol.for('PathRepository'),
  FileRepository: Symbol.for('FileRepository'),
  ContentRepository: Symbol.for('ContentRepository'),
  ManifestRepository: Symbol.for('ManifestRepository'),
  FeedRepository: Symbol.for('FeedRepository'),
  DownloadVodRepository: Symbol.for('DownloadVodRepository'),
  DownloadClipRepository: Symbol.for('DownloadClipRepository'),
  DownloadLiveRepository: Symbol.for('DownloadLiveRepository')
}

const UseCases = {
  AuthVodUseCase: Symbol.for('AuthVodUseCase'),
  AuthClipUseCase: Symbol.for('AuthClipUseCase'),
  AuthLiveUseCase: Symbol.for('AuthLiveUseCase'),
  GetVodIdFromUrlUseCase: Symbol.for('GetVodIdFromUrlUseCase'),
  GetClipIdFromUrlUseCase: Symbol.for('GetClipIdFromUrlUseCase'),
  GetLiveIdFromUrlUseCase: Symbol.for('GetLiveIdFromUrlUseCase'),
  DetectContentTypeUseCase: Symbol.for('DetectContentTypeUseCase'),
  GetVodManifestUseCase: Symbol.for('GetVodManifestUseCase'),
  GetClipManifestUseCase: Symbol.for('GetClipManifestUseCase'),
  GetLiveManifestUseCase: Symbol.for('GetLiveManifestUseCase'),
  GetFeedFromManifestUseCase: Symbol.for('GetFeedFromManifestUseCase'),
  ParseFeedUseCase: Symbol.for('ParseFeedUseCase'),
  DownloadVodFromFeedUseCase: Symbol.for('DownloadVodFromFeedUseCase'),
  DownloadClipFromFeedUseCase: Symbol.for('DownloadClipFromFeedUseCase'),
  DownloadLiveFromFeedUseCase: Symbol.for('DownloadLiveFromFeedUseCase'),
  GetFileFromPathUseCase: Symbol.for('GetFileFromPathUseCase'),
  GetExtensionFromPlaylistUseCase: Symbol.for('GetExtensionFromPlaylistUseCase'),
  GetUrlsFromTxtFileUseCase: Symbol.for('GetUrlsFromTxtFileUseCase')
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
