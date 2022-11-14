/*
    Path to save into the system
 */

import { ValueObject } from './valueObject'

export class ExtensionVo extends ValueObject<string> {
  public equals (valueObject: ExtensionVo) {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string) {

  }
}
