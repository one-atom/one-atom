import { safeJsonParse } from './safe_json_parse';

export class ApplicationStorage<T extends Record<string, unknown>> {
  private readonly store: Storage;
  private readonly prefix: string;

  constructor(type: ApplicationStorage.StoreType, prefix?: string) {
    this.prefix = prefix ?? '';

    this.store = type === 'local' ? localStorage : sessionStorage;
  }

  public get(key: keyof T): T[typeof key] | null {
    const item = this.store.getItem(this.retrieve_prefix(key));

    if (!item) return null;

    return safeJsonParse(item);
  }

  public set(key: keyof T, data: T[typeof key] | null): void {
    this.store.setItem(this.retrieve_prefix(key), JSON.stringify(data));
  }

  public remove_item(key: keyof T): void {
    this.store.removeItem(this.retrieve_prefix(key));
  }

  private retrieve_prefix(key: keyof T): string {
    return `${this.prefix || ''}${key}`;
  }
}
export namespace ApplicationStorage {
  export type StoreType = 'session' | 'local';
}
