/*
    ID of the CLIP
 */

import {ValueObject} from './valueObject'
import {VOFormatException} from '../errors/voFormatException'

export class IdClipVo extends ValueObject<string> {
  public equals (valueObject: IdClipVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string) {
    if (value.length > 255) {
      throw new VOFormatException(IdClipVo.name, value)
    }
  }
}
