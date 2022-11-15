/*
    Path to save into the system
 */

import { ValueObject } from './valueObject'
import Quality from '../../infrastructure/types/Quality'

export class QualityVo extends ValueObject<Quality> {
  public equals (valueObject: QualityVo): boolean {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: Quality): void {

  }

  public setQualityString (): void {
    this.value.quality = this.value.quality.endsWith('p') ? this.value.quality : this.value.quality + 'p'
  }
}
