/*
    Path to save into the system
 */

import { ValueObject } from './valueObject'
import { VOFormatException } from '../errors/voFormatException'

const IS_VOD = /videos\/\d+/i
const IS_CLIP = /clip\//i
const IS_LIVE = /\.tv\/[\w]*/i

export class UrlVo extends ValueObject<string> {
  public equals (valueObject: UrlVo): boolean {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string): void {
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

  public isLive (): boolean {
    return IS_LIVE.test(this.value)
  }
}
