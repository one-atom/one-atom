import fs, { PathLike } from 'fs';
import json5 from 'json5';

export class Locator {
  public static dir_exists(path: PathLike): boolean {
    if (fs.existsSync(path)) return true;

    return false;
  }

  /**
   * @description Returns a promise that, if valid, contains parsed JSON5 object.
   */
  public static read_json<T extends Record<string, unknown>>(path: PathLike): Promise<T | null> {
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

  /**
   * @description Returns, if valid, a parsed JSON5 object.
   */
  public static read_json_sync<T extends Record<string, unknown>>(path: PathLike): T | null {
    try {
      const content = fs.readFileSync(path, 'utf8');

      if (!content) return null;

      return json5.parse(content);
    } catch (error) {
      return null;
    }
  }
}
