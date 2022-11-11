/*
  M3U8 Manifest
 */

import {ValueObject} from './valueObject'
import {VOFormatException} from '../errors/voFormatException'
import Feed from '../../infrastructure/types/Feed'

export class FeedVo extends ValueObject<Feed> {
  public equals (valueObject: FeedVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: Feed) {
    if (Object.keys(value).length === 0) {
      throw new VOFormatException(FeedVo.name, value)
    }
  }
}
