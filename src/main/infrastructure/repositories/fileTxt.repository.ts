import { injectable } from 'inversify'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { PathVo } from '../../domain/valueObjects/path.vo'
import { readFileSync } from 'fs'

import { IFileRepository } from '../../domain/repository/fileRepository.interface'

@injectable()
export class FileTxtRepository implements IFileRepository {
  getUrls (path: PathVo): UrlVo[] {
    const fileString: string = readFileSync(path.value).toString()
    const urls: UrlVo[] = []
    const fileLines: string[] = fileString.split('\n')
    fileLines.forEach((line: string) => {
      const url: UrlVo = new UrlVo(line)
      urls.push(url)
    })

    return urls
  }
}
