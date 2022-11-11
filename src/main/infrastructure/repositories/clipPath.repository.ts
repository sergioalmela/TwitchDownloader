import {injectable} from 'inversify'
import {InvalidUrlException} from '../errors/invalidUrl.exception'
import {IPathRepository} from '../../domain/repository/pathRepository.interface'
import {UrlVo} from '../../domain/valueObjects/url.vo'
import {Id} from '../../domain/valueObjects/id.vo'

@injectable()
export class ClipPathRepository implements IPathRepository {
  getId (url: UrlVo): Id {
    const id = (url.value.split('/').pop()).split(/[?#]/)[0]

    if (!id) {
      throw new InvalidUrlException()
    }

    return new Id(id)
  }
}
