/** Symbols for repositories */
const Repositories = {
  AuthRepository: Symbol.for('AuthRepository'),
  PathRepository: Symbol.for('PathRepository')
}

const UseCases = {
  AuthVodUseCase: Symbol.for('AuthVodUseCase'),
  AuthClipUseCase: Symbol.for('AuthClipUseCase'),
  GetVodIdFromUrlUseCase: Symbol.for('GetVodIdFromUrlUseCase'),
  GetClipIdFromUrlUseCase: Symbol.for('GetClipIdFromUrlUseCase')
}

const Controllers = {
  AuthController: Symbol.for('AuthController')
}

const ContainerSymbols = {
  ...Repositories,
  ...UseCases,
  ...Controllers
}

export { ContainerSymbols }
