/*
  M3U8 Manifest
 */

import { ValueObject } from './valueObject'
import { VOFormatException } from '../errors/voFormatException'

export class ManifestVo extends ValueObject<string> {
  public equals (valueObject: ManifestVo): boolean {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string): void {
    if (!value.includes('http')) {
      throw new VOFormatException(ManifestVo.name, value)
    }
  }
}
