/*
    Path to save into the system
 */

import {ValueObject} from './valueObject'

const PATH_REGEX = /^([a-zA-Z]:)?(\\\\[^<>:"/\\\\|?*]+)+\\\\?$/i

export class PathVo extends ValueObject<string> {
  public equals (valueObject: PathVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string) {
    // Remove file name and extension from path, first check if path has '/', and append '/' if doesn't have
    if (value.includes('/')) {
      value = value.substring(0, value.lastIndexOf('/')) + '/'
    } else if (value.includes('\\')) {
      value = value.substring(0, value.lastIndexOf('\\')) + '\\'
    } else {
      value = ''
    }

    this.value = value
  }
}
