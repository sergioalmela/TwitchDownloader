export class FileNotFoundException extends Error {
  constructor (path: string) {
    super(`File not found: ${path}`)
  }
}
