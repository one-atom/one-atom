/* eslint-disable @typescript-eslint/ban-types */

export type MutationFn<T extends object> = (currentState: Readonly<Omit<DataStruct<T>, 'insert'>>) => Partial<T>;

export class DataStruct<T extends object> {
  private readonly storedData = new Map<keyof T, T[keyof T]>();
  private readonly keys: Set<string>;

  constructor(data: T) {
    this.keys = new Set(Object.keys(data));
    this.insert(data);
  }

  public insert(fromObject: Partial<T>): void {
    for (const _ in fromObject) {
      const key = _ as keyof T;
      const preValue = this.storedData.get(key);

      // TODO: add suppport for dynamic length
      // Continue if undefined, from_object is Partial<T> and we can't determine
      // if the value or index was undefined. Null should be used to represent
      // non-assigned values
      if (fromObject[key] === undefined) {
        continue;
      }

      // Keeps the mem ref to the original object and
      if (typeof preValue === 'object' && preValue === fromObject[key]) {
        this.storedData.set(key, fromObject[key] as T[keyof T]);
        continue;
      }

      this.storedData.set(key, fromObject[key] as T[keyof T]);
    }
  }

  public extract(): T {
    const builder: Partial<T> = {};

    for (const _ of this.keys.values()) {
      const key = _ as keyof T;
      builder[key] = this.storedData.get(key);
    }

    return builder as T;
  }

  public toIter(): IterableIterator<[keyof T, T[keyof T]]> {
    return this.storedData.entries();
  }
}
