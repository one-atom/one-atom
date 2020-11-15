import path from 'path';
import { TypeScriptConfig } from './_config_typeScript';

export namespace Paths {
  export type Dictionary = {
    root: string;
    outDir: string;
    rootDir: string;
    dir: string;
    html: string;
    main: string;
    packageJson: string;
    nodeModules: string;
  };

  export function get(root: string): Readonly<Dictionary> {
    const { outDir, rootDir } = TypeScriptConfig.getCompilerOptions(root);

    function resolveRelative(root: string, location: string): string {
      return path.resolve(root, location);
    }

    return Object.freeze({
      root,
      dir: resolveRelative(root, 'public'),
      outDir: resolveRelative(root, outDir),
      rootDir: resolveRelative(root, rootDir),
      html: resolveRelative(root, 'public/index.html'),
      main: resolveRelative(root, `${rootDir}/main.tsx`),
      packageJson: resolveRelative(root, 'package.json'),
      nodeModules: resolveRelative(root, 'node_modules'),
    });
  }
}
