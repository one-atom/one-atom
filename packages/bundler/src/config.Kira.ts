import { Locator } from '@kira/helper-filesystem';

export namespace KiraConfig {
  type KiraConfigLike = {
    [key: string]: {
      [key: string]: string | number | null;
    };
  };

  export function get_custom_env(location: string): KiraConfigLike | null {
    const json5 = Locator.read_json_sync<KiraConfigLike>(`${location}/kira.env.json5`);

    if (json5 !== null) return json5;

    return Locator.read_json_sync<KiraConfigLike>(`${location}/kira.env.json`);
  }
}
