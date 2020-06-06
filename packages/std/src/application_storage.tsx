import { safeJsonParse } from './safe_json_parse';

export namespace ApplicationStorage {
  type StoreType = 'session' | 'local';

  export class Instance {
    private readonly store: Storage;
    private readonly prefix: string;

    constructor(type: StoreType, prefix?: string) {
      this.prefix = prefix ?? '';

      this.store = type === 'local' ? localStorage : sessionStorage;
    }

    public get<T = string>(key: string): T | null {
      const item = this.store.getItem(`${this.prefix || ''}${key}`);

      if (!item) return null;

      return safeJsonParse<T>(item);
    }

    public set(key: string, data: any) {
      this.store.setItem(`${this.prefix || ''}${key}`, JSON.stringify(data));
    }

    public remove_item(key: string) {
      this.store.removeItem(`${this.prefix || ''}${key}`);
    }
  }
}
