export abstract class ValueObject<T> {
  constructor (public value: T) {
    this.assertIsValid(value)
  }

  public abstract equals (valueObject: ValueObject<T>): boolean

  protected abstract assertIsValid (value: T): void
}
