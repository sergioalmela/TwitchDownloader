/*
    Path to save into the system
 */

import { ValueObject } from './valueObject'

const PATH_REGEX = /^([a-zA-Z]:)?(\\\\[^<>:"/\\\\|?*]+)+\\\\?$/i

export class PathVo extends ValueObject<string> {
  public equals (valueObject: PathVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string) {

  }
}
