/*
  M3U8 Manifest
 */

import {ValueObject} from './valueObject'
import {VOFormatException} from '../errors/voFormatException'

export class ManifestVo extends ValueObject<string> {
    public equals (valueObject: ManifestVo) {
        return this.value === valueObject.value
    }

    protected assertIsValid (value: string) {
        // Check if contains .m3u8
        if (!value.includes('.m3u8')) {
            throw new VOFormatException(ManifestVo.name, value)
        }
    }
}
