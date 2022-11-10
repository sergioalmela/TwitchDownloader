import {injectable} from 'inversify'
import {IdVodVo} from '../../domain/valueObjects/idVod.vo'
import {InvalidUrlException} from '../errors/invalidUrl.exception'
import {IPathRepository} from '../../domain/repository/pathRepository.interface'
import {IdClipVo} from '../../domain/valueObjects/idClip.vo'

@injectable()
export class PathRepository implements IPathRepository {
  getVodId (url: string): IdVodVo {
    const regex = /(?<=videos\/)(\d+)/g
    const id = url.match(regex)

    if (!id) {
      throw new InvalidUrlException()
    }

    return new IdVodVo(id[0])
  }

  getClipId (url: string): IdClipVo {
    const id = (url.split("/").pop()).split(/[?#]/)[0]

    if (!id) {
      throw new InvalidUrlException()
    }

    return new IdClipVo(id)
  }
}
