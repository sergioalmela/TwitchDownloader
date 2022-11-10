/*
  ID of the VOD video
 */

import {ValueObject} from './valueObject'
import {VOFormatException} from '../errors/voFormatException'

const ID_VOD_REGEX = /^\d{1,10}$/

export class IdVodVo extends ValueObject<string> {
  public equals (valueObject: IdVodVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string) {
    if (!ID_VOD_REGEX.test(value)) {
      throw new VOFormatException(IdVodVo.name, value)
    }
  }
}
