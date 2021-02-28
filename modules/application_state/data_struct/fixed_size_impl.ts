/* eslint-disable @typescript-eslint/ban-types */

import { DataStruct } from './mod';

export type MutationFn<T extends object> = (currentState: Readonly<Omit<FixedSizeImpl<T>, 'insert'>>) => Partial<T>;

export class FixedSizeImpl<T extends object> implements DataStruct {
  private readonly storedData = new Map<keyof T, T[keyof T]>();
  private readonly keys: Set<string | number | Symbol>;

  constructor(data: T) {
    this.keys = new Set(Object.keys(data));
    this.insert(data);
  }

  public insert(fromObject: Partial<T>): Set<keyof T> {
    const changeSet = new Set<keyof T>();

    for (const _ in fromObject) {
      const key = _ as keyof T;
      const preValue = this.storedData.get(key);
      changeSet.add(key);

      if (!this.keys.has(key)) {
        this.keys.add(key);
      } else if (typeof preValue === 'object' && preValue === fromObject[key]) {
        // Keeps the mem ref to the original object
        this.storedData.set(key, fromObject[key] as T[keyof T]);
        continue;
      }

      this.storedData.set(key, fromObject[key] as T[keyof T]);
    }

    return changeSet;
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
