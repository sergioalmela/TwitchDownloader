import {injectable} from 'inversify'
import {IdVodVo} from '../../domain/valueObjects/idVod.vo'
import {InvalidUrlException} from '../errors/invalidUrl.exception'
import {IPathRepository} from '../../domain/repository/pathRepository.interface'
import {IdClipVo} from '../../domain/valueObjects/idClip.vo'
import {UrlVo} from "../../domain/valueObjects/url.vo";

@injectable()
export class PathRepository implements IPathRepository {
  getVodId (url: UrlVo): IdVodVo {
    const regex = /(?<=videos\/)(\d+)/g
    const id = url.value.match(regex)

    if (!id) {
      throw new InvalidUrlException()
    }

    return new IdVodVo(id[0])
  }

  getClipId (url: UrlVo): IdClipVo {
    const id = (url.value.split("/").pop()).split(/[?#]/)[0]

    if (!id) {
      throw new InvalidUrlException()
    }

    return new IdClipVo(id)
  }
}
