/*
    Path to save into the system
 */

import { ValueObject } from './valueObject'

const DEFAULT_NAME = 'twitchDownload'

export class FileVo extends ValueObject<string> {
  public equals (valueObject: FileVo): boolean {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string): void {
    if (value.length === 0) {
      this.setDefaultValue()
    }
  }

  public getDefaultName (): string {
    return DEFAULT_NAME
  }

  public setDefaultValue (): void {
    this.value = `${DEFAULT_NAME}_${this.getCurrentDate()}`
  }

  private getCurrentDate (): string {
    return Date.now().toString()
  }

  public removeExtensionFromFileName (): void {
    if (this.value.includes('.')) {
      this.value = this.value.substring(0, this.value.lastIndexOf('.'))
    }
  }

  public getValue (): string {
    return this.value
  }
}
