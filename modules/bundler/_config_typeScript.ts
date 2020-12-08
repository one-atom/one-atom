import { Logger } from '../logger/mod';
import { readJsonSync } from './_utils/mod';

export namespace TypeScriptConfig {
  type ParsedCompilerOptions = {
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
    rootDir?: string;
    [key: string]: unknown;
  };

  type TsConfigLike = {
    compilerOptions?: CompilerOptionsLike;
  };

  export let cachedCompilerOption: ParsedCompilerOptions | null = null;

  /**
   * Returns a CompilerOption. If file system can not locate or validate a
   * tsconfig.json file, a default CompilerOption will be provided
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

  function parseTypeScriptCompilerOptions(tsConfigLike?: TsConfigLike): Readonly<ParsedCompilerOptions> {
    const builder: ParsedCompilerOptions = {
      // Defaults
      baseUrl: '/',
      outDir: 'dist',
      rootDir: './',
      lib: './',
      module: './',
      paths: {},
    };

    // If compilerOptions is provided, validate it and mutate the builder with
    // provided configuration
    const { compilerOptions } = tsConfigLike ?? {};

    if (compilerOptions) {
      Logger.assert(Logger.Level.INFO, 'compilerOptions found, replacing defaults ...');

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
