/*
    ID of the CLIP
 */

import { ValueObject } from './valueObject'
import { VOFormatException } from '../errors/voFormatException'

export class IdVo extends ValueObject<string> {
  public equals (valueObject: IdVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string) {
    if (value.length > 255 || value.length === 0) {
      throw new VOFormatException(IdVo.name, value)
    }
  }
}
