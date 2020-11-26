import path from 'path';
import { TypeScriptConfig } from './_config_typeScript';

export namespace Paths {
  export interface Dictionary {
    root: string;
    outDir: string;
    rootDir: string;
    static: string;
    html: string;
    main: string;
    packageJson: string;
    nodeModules: string;
  }

  export interface Option {
    contentBase?: string;
    relativeIndexHTMLPath?: string;
  }

  export function get(root: string, option?: Option): Readonly<Dictionary> {
    const { outDir, rootDir } = TypeScriptConfig.getCompilerOptions(root);

    function resolveRelative(root: string, location: string): string {
      return path.resolve(root, location);
    }

    const STATIC_DEFAULT = 'public';

    return Object.freeze({
      root,
      static: resolveRelative(root, option?.contentBase ?? STATIC_DEFAULT),
      outDir: resolveRelative(root, outDir),
      rootDir: resolveRelative(root, rootDir),
      html: resolveRelative(root, `${option?.relativeIndexHTMLPath ?? option?.contentBase ?? STATIC_DEFAULT}/index.html`),
      main: resolveRelative(root, `${rootDir}/main.tsx`),
      packageJson: resolveRelative(root, 'package.json'),
      nodeModules: resolveRelative(root, 'node_modules'),
    });
  }
}
