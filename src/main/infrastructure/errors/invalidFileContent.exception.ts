export class InvalidFileContentException extends Error {
  constructor (path: string) {
    super(`Invalid file content: ${path}`)
  }
}
