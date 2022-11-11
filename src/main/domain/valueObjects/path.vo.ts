/*
    Path to save into the system
 */

import { ValueObject } from './valueObject'
import { VOFormatException } from '../errors/voFormatException'

const PATH_REGEX = /^([a-zA-Z]:)?(\\\\[^<>:"/\\\\|?*]+)+\\\\?$/i

export class PathVo extends ValueObject<string> {
  public equals (valueObject: PathVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string) {
    // If is a valid path (windows, Linux, Mac)
    if (!PATH_REGEX.test(value)) {
      throw new VOFormatException(PathVo.name, value)
    }
  }
}
