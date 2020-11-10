import fs, { PathLike } from 'fs';
import json5 from 'json5';

namespace Locator {
  export function dirExists(path: PathLike): boolean {
    if (fs.existsSync(path)) return true;

    return false;
  }

  /** Returns a promise that, if valid, contains parsed JSON5 object. */
  export function readJson<T extends Record<string, unknown>>(path: PathLike): Promise<T | null> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'UTF8', (error, buffer) => {
        if (error) return reject(null);

        try {
          const parse = json5.parse(buffer);

          resolve(parse);
        } catch (error) {
          reject(null);
        }
      });
    });
  }

  /** Returns, if valid, a parsed JSON5 object. */
  export function readJsonSync<T extends Record<string, unknown>>(path: PathLike): T | null {
    try {
      const content = fs.readFileSync(path, 'utf8');

      if (!content) return null;

      return json5.parse(content);
    } catch (error) {
      return null;
    }
  }
}
