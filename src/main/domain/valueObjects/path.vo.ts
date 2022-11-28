/*
    Path to save into the system
 */

import { ValueObject } from './valueObject'

export class PathVo extends ValueObject<string> {
  public equals (valueObject: PathVo): boolean {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: string): void {
    // Replace all \ with / if exists for Windows paths
    if (value.includes('\\')) {
      this.value = value.replace(/\\/g, '/')
    }
  }

  public removeFileFromPath (): void {
    let value = this.value
    // Remove file name and extension from path, first check if path has '/', and append '/' if doesn't have
    if (value.includes('/')) {
      value = this.value.substring(0, value.lastIndexOf('/')) + '/'
    } else if (this.value.includes('\\')) {
      value = this.value.substring(0, value.lastIndexOf('\\')) + '\\'
    } else {
      value = ''
    }

    this.value = value
  }

  public addTrailingSlash (): void {
    if (!this.value.endsWith('/')) {
      this.value = this.value + '/'
    }
  }
}
