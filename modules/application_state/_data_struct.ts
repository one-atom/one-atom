type ValidStateDataType = string | number | symbol | boolean | null | Array<unknown> | Record<string, unknown>;

export type ValidStateData = Record<string, ValidStateDataType>;

export type MutationFn<T extends ValidStateData> = (currentState: Readonly<Omit<DataStruct<T>, 'insert'>>) => Partial<T>;

export class DataStruct<T extends ValidStateData> {
  private readonly storedData = new Map<keyof T, T[keyof T]>();
  private readonly keys: string[];

  constructor(data: T) {
    this.keys = Object.keys(data);
    this.insert(data);
  }

  public insert(fromObject: Partial<T>): void {
    for (const key of this.keys) {
      const preValue = this.storedData.get(key);

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
    const builder: Record<string, unknown> = {};

    for (const key of this.keys) {
      builder[key] = this.storedData.get(key);
    }

    return builder as T;
  }

  public toIter(): IterableIterator<[keyof T, T[keyof T]]> {
    return this.storedData.entries();
  }
}
