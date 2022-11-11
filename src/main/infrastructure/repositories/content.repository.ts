import {injectable} from 'inversify'
import {ContentTypes} from '../../domain/constants/contentTypes.enum'
import {UrlVo} from '../../domain/valueObjects/url.vo'

@injectable()
export class ContentRepository {
  getContentType (url: UrlVo): ContentTypes {
    // Check if URL contains ID_VOD_REGEX
    return url.isVod() ? ContentTypes.VOD : ContentTypes.CLIP
  }
}
