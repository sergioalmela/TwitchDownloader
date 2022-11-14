/*
    Path to save into the system
 */

import { ValueObject } from './valueObject'

const DEFAULT_NAME = 'twitchDownload'

export class FileVo extends ValueObject<string> {
  public equals (valueObject: FileVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string) {
    // Remove extension from file
    if (value.includes('.')) {
      this.value = value.substring(0, value.lastIndexOf('.'))
    }

    if (value.length === 0) {
      this.value = DEFAULT_NAME
    }
  }
}
