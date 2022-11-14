import {injectable} from 'inversify'
import {InvalidUrlException} from '../errors/invalidUrl.exception'
import {IUrlRepository} from '../../domain/repository/urlRepository.interface'
import {UrlVo} from '../../domain/valueObjects/url.vo'
import {IdVo} from '../../domain/valueObjects/id.vo'

@injectable()
export class UrlVodRepository implements IUrlRepository {
  getId (url: UrlVo): IdVo {
    const regex = /(?<=videos\/)(\d+)/g
    const id = url.value.match(regex)

    if (id == null) {
      throw new InvalidUrlException()
    }

    return new IdVo(id[0])
  }
}
