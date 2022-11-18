import { injectable } from 'inversify'
import { ContentTypes } from '../../domain/constants/contentTypes.enum'
import { UrlVo } from '../../domain/valueObjects/url.vo'

@injectable()
export class ContentRepository {
  getContentType (url: UrlVo): ContentTypes {
    // Check if URL is vod, is clip or anything else
    if (url.isVod()) {
      return ContentTypes.VOD
    } else if (url.isClip()) {
      return ContentTypes.CLIP
    } else if (url.isLive()) {
      return ContentTypes.LIVE
    } else {
      return ContentTypes.UNKNOWN
    }
  }
}
