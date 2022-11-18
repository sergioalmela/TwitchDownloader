import { injectable } from 'inversify'
import { InvalidUrlException } from '../errors/invalidUrl.exception'
import { IUrlRepository } from '../../domain/repository/urlRepository.interface'
import { UrlVo } from '../../domain/valueObjects/url.vo'
import { IdVo } from '../../domain/valueObjects/id.vo'

@injectable()
export class UrlLiveRepository implements IUrlRepository {
  getId (url: UrlVo): IdVo {
    const separatedUrl = url.value.split('/')

    const id = separatedUrl.length > 0 ? separatedUrl[separatedUrl.length - 1].split(/[?#]/)[0] : ''

    if (id === '') {
      throw new InvalidUrlException()
    }

    return new IdVo(id)
  }
}
