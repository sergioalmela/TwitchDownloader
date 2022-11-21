import { injectable } from 'inversify'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { readFileSync } from 'fs'

import { IFileRepository } from '../../domain/repository/fileRepository.interface'
import { FileNotFoundException } from '../errors/fileNotFound.exception'
import { InvalidFileContentException } from '../errors/invalidFileContent.exception'

@injectable()
export class FileTxtRepository implements IFileRepository {
  getUrls (path: PathVo): UrlVo[] {
    let fileString: string
    try {
      fileString = readFileSync(path.value).toString()
    } catch (error) {
      throw new FileNotFoundException(path.value)
    }

    const urls: UrlVo[] = []
    try {
      const fileLines: string[] = fileString.split('\n')
      fileLines.forEach((line: string) => {
        const url: UrlVo = new UrlVo(line)
        urls.push(url)
      })
    } catch (error) {
      throw new InvalidFileContentException(path.value)
    }

    return urls
  }
}
