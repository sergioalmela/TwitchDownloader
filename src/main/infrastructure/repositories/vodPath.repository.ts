import {injectable} from 'inversify'
import {InvalidUrlException} from '../errors/invalidUrl.exception'
import {IPathRepository} from '../../domain/repository/pathRepository.interface'
import {UrlVo} from '../../domain/valueObjects/url.vo'
import {Id} from '../../domain/valueObjects/id.vo'

@injectable()
export class VodPathRepository implements IPathRepository {
  getId (url: UrlVo): Id {
    const regex = /(?<=videos\/)(\d+)/g
    const id = url.value.match(regex)

    if (!id) {
      throw new InvalidUrlException()
    }

    return new Id(id[0])
  }
}
