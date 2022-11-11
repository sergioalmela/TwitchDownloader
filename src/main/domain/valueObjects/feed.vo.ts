/*
  M3U8 Manifest
 */

import { ValueObject } from './valueObject'
import { VOFormatException } from '../errors/voFormatException'

export class FeedVo extends ValueObject<Array<string>> {
  public equals (valueObject: FeedVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: Array<string>) {
    if (value.length === 0) {
      throw new VOFormatException(FeedVo.name, value)
    }
  }
}
