import { Locator } from '@kira/helper-filesystem';
import { Logger } from '@kira/logger';

export namespace KiraConfig {
  type ValuePrimitive = string | number | boolean | RegExp | null | undefined;
  type ValueObject = ValuePrimitive | { [key: string]: ValueObject };
  export type KiraConfigLike = { [key: string]: ValueObject };

  export const CUSTOM_ENV = 'CUSTOM_ENV';
  export const CUSTOM_GLOBAL_ENV = 'CUSTOM_GLOBAL_ENV';

  export function get_custom_env(location: string): KiraConfigLike | null {
    try {
      const located_json = Locator.read_json_sync<KiraConfigLike>(location);
      const builder: KiraConfigLike = {};

      for (const key in located_json) {
        const value = located_json[key];

        switch (value) {
          case value === null:
          case typeof value === 'boolean':
          case typeof value === 'number':
            builder[key] = value;
            break;
          // JSON.stringify strings, objects and arrays so that Webpack may run
          // JSON.parse later without getting Uncaught ReferenceError when
          // referring to process.env.CUSTOM_GLOBAL_ENV
          default:
            builder[key] = JSON.stringify(value);
        }
      }

      return builder;
    } catch (error) {
      Logger.assert(Logger.Level.ERROR, error);

      return null;
    }
  }
}
