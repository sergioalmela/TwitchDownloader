/*
    Path to save into the system
 */

import { ValueObject } from './valueObject'
import { VOFormatException } from '../errors/voFormatException'

export class ExtensionVo extends ValueObject<string> {
  public equals (valueObject: ExtensionVo): boolean {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string): void {
    if (value.length === 0) {
      throw new VOFormatException(ExtensionVo.name, value)
    }
  }
}
