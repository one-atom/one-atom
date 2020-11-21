/* eslint-disable @typescript-eslint/no-explicit-any*/

import ts from 'typescript';
import { Logger } from '../logger/mod';
import { readJsonSync } from './_utils/mod';

export namespace TypeScriptConfig {
  type ParsedCompilerOptions = {
    target: ts.ScriptTarget;
    module: string;
    lib: string;
    outDir: string;
    rootDir: string;
    paths: { [key: string]: string };
    baseUrl: string;
  };

  type CompilerOptionsLike = {
    baseUrl?: string;
    outDir?: string;
    module?: string;
    target?: string;
    rootDir?: string;
    [key: string]: any;
  };

  type TsConfigLike = {
    compilerOptions?: CompilerOptionsLike;
  };

  const targets = {
    es3: ts.ScriptTarget.ES3,
    es5: ts.ScriptTarget.ES5,
    es6: ts.ScriptTarget.ES2015,
    es2015: ts.ScriptTarget.ES2015,
    es2016: ts.ScriptTarget.ES2016,
    es2017: ts.ScriptTarget.ES2017,
    es2018: ts.ScriptTarget.ES2018,
    es2019: ts.ScriptTarget.ES2019,
    es2020: ts.ScriptTarget.ES2020,
    esnext: ts.ScriptTarget.ESNext,
  };

  export let cachedCompilerOption: ParsedCompilerOptions | null = null;

  /**
   * Returns a CompilerOption. If file system can not locate or validate a
   * tsconfig.json file, a default CompilerOption will be provided
   *
   * @param location Directory to search for a tsconfig.json file
   * @public
   */
  export function getCompilerOptions(location: string): ParsedCompilerOptions {
    cachedCompilerOption = null;

    const tsconfig = readJsonSync<TsConfigLike>(`${location}/tsconfig.json`);
    if (tsconfig === null) {
      throw new Error(`could not locate a tsconfig at ${location}`);
    }

    const parsedCompilerOption = parseTypeScriptCompilerOptions(tsconfig);
    cachedCompilerOption = parsedCompilerOption;

    return cachedCompilerOption;
  }

  function parseTypeScriptCompilerOptions(ts_config_like?: TsConfigLike): Readonly<ParsedCompilerOptions> {
    const builder: ParsedCompilerOptions = {
      // Defaults
      target: ts.ScriptTarget.ES2019,
      baseUrl: '/',
      outDir: 'dist',
      rootDir: 'src',
      lib: '',
      module: '',
      paths: {},
    };

    // If compilerOptions is provided, validate it and mutate the builder with
    // provided configuration
    const { compilerOptions } = ts_config_like ?? {};

    if (compilerOptions) {
      Logger.assert(Logger.Level.INFO, 'compilerOptions found, replacing defaults ...');

      const target = compilerOptions.target?.toLowerCase() as keyof typeof targets | undefined;
      if (target && targets[target]) {
        builder.target = targets[target];
        Logger.assert(Logger.Level.VERBOSE, `using ${builder.target} as "target"`);
      }

      if (compilerOptions.rootDir) {
        builder.rootDir = compilerOptions.rootDir;
        Logger.assert(Logger.Level.VERBOSE, `using ${builder.rootDir} as "rootDir"`);
      }

      if (compilerOptions.module) {
        builder.module = compilerOptions.module;
        Logger.assert(Logger.Level.VERBOSE, `using ${builder.module} as "module"`);
      }

      if (compilerOptions.outDir) {
        builder.outDir = compilerOptions.outDir;
        Logger.assert(Logger.Level.VERBOSE, `using ${builder.outDir} as "outDir"`);
      }

      if (compilerOptions.baseUrl) {
        builder.baseUrl = compilerOptions.baseUrl;
        Logger.assert(Logger.Level.VERBOSE, `using ${builder.baseUrl} as "baseUrl"`);
      }
    }

    return Object.freeze(builder);
  }
}
