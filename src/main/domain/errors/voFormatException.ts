import {DomainFormatException} from './domainFormatException'

export class VOFormatException extends DomainFormatException {
  constructor (constructorName: string, value: any) {
    super(`${constructorName}: Invalid value ${JSON.stringify(value)}`)
  }
}
