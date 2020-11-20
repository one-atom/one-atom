import fs, { PathLike } from 'fs';
import json5 from 'json5';

export function readJsonSync<T extends Record<string, unknown>>(path: PathLike): T | null {
  try {
    const content = fs.readFileSync(path, 'utf8');

    if (!content) return null;

    return json5.parse(content);
  } catch (error) {
    return null;
  }
}
