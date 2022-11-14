/*
    Path to save into the system
 */

import {ValueObject} from './valueObject'
import {VOFormatException} from '../errors/voFormatException'

const IS_VOD = /videos\/\d+/i
const IS_CLIP = /clip\//i

export class UrlVo extends ValueObject<string> {
  public equals (valueObject: UrlVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string) {
    if (value.length === 0) {
      throw new VOFormatException(UrlVo.name, value)
    }
  }

  public isVod (): boolean {
    return IS_VOD.test(this.value)
  }

  public isClip (): boolean {
    return IS_CLIP.test(this.value)
  }
}
