import fs, { PathLike } from 'fs';
import json5 from 'json5';

export enum JsonFailReturnStates {
  ReadFileFail = 0,
  ParseFileFail = -1,
  UnknownFail = -99,
}

export function readJsonSync<T extends Record<string, unknown>>(
  path: PathLike,
): [data: T] | [data: null, error: JsonFailReturnStates] {
  try {
    const content = fs.readFileSync(path, 'utf8');

    return [json5.parse(content)];
  } catch (error: unknown) {
    const { code, lineNumber } = error as { code?: string; lineNumber?: string };

    if (code === 'ENOENT') {
      return [null, JsonFailReturnStates.ReadFileFail];
    }

    if (lineNumber) {
      return [null, JsonFailReturnStates.ParseFileFail];
    }

    return [null, JsonFailReturnStates.UnknownFail];
  }
}
