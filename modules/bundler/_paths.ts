import { types } from '@babel/core';
import path from 'path';
import { TypeScriptConfig } from './_config_typeScript';

export namespace Paths {
  export interface PathList {
    root: string;
    outDir: string;
    rootDir: string;
    static: string;
    html: string;
    main: string;
    packageJson: string;
    nodeModules: string;
    tsConfig: string;
  }

  export interface Option {
    contentBase?: string;
    relativeIndexHTMLPath?: string;
    configFile?: string;
  }

  export function get(root: string, option?: Option): Readonly<PathList> {
    const { outDir, rootDir } = TypeScriptConfig.getCompilerOptions(root, option?.configFile);

    function resolveRelative(root: string, location: string): string {
      return path.resolve(root, location);
    }

    const STATIC_DEFAULT = 'public';

    return Object.freeze({
      root,
      static: resolveRelative(root, option?.contentBase ?? STATIC_DEFAULT),
      outDir: resolveRelative(root, outDir ?? 'dist'),
      rootDir: resolveRelative(root, rootDir ?? './'),
      html: resolveRelative(root, `${option?.relativeIndexHTMLPath ?? option?.contentBase ?? STATIC_DEFAULT}/index.html`),
      main: resolveRelative(root, `${rootDir}/main.tsx`),
      packageJson: resolveRelative(root, 'package.json'),
      nodeModules: resolveRelative(root, 'node_modules'),
      tsConfig: resolveRelative(root, TypeScriptConfig.getTsConfigPath(root, option?.configFile)),
    });
  }
}
