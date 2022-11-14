import {injectable} from 'inversify'
import {ContentTypes} from '../../domain/constants/contentTypes.enum'
import {UrlVo} from '../../domain/valueObjects/url.vo'

@injectable()
export class ContentRepository {
  getContentType (url: UrlVo): ContentTypes {
    // Check if URL is vod, is clip or anything else
    return url.isVod()
      ? ContentTypes.VOD
      : url.isClip()
        ? ContentTypes.CLIP
        : ContentTypes.UNKNOWN
  }
}
