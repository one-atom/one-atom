import { JsonFailReturnStates, readJsonSync } from './_utils/mod';
import { Logger } from '../logger/mod';

export namespace InjectProcessConfig {
  type ValuePrimitive = string | number | boolean | RegExp | null | undefined;
  type ValueObject = ValuePrimitive | { [key: string]: ValueObject };
  export type InjectProcessConfigLike = { [key: string]: ValueObject };

  export const CUSTOM_ENV = 'CUSTOM_ENV';
  export const CUSTOM_GLOBAL_ENV = 'CUSTOM_GLOBAL_ENV';

  export function getCustomEnv(locationOrConfig: string | Record<string, unknown>): InjectProcessConfigLike | null {
    try {
      let parsingObj: Record<string, unknown>;

      if (typeof locationOrConfig === 'string') {
        const [locatedJson, error] = readJsonSync<Record<string, unknown>>(locationOrConfig);

        if (!locatedJson) {
          if (error === JsonFailReturnStates.ReadFileFail) {
            throw new Error(`Could not locale the file at ${locationOrConfig}`);
          }

          throw new Error(`Could not parse the file located at ${locationOrConfig}`);
        }

        parsingObj = locatedJson;
      } else {
        parsingObj = locationOrConfig;
      }

      const builder: InjectProcessConfigLike = {};

      for (const key in parsingObj) {
        const value = parsingObj[key];

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
