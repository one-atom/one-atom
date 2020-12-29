import * as compiler from 'typescript';

export namespace TypeScriptConfig {
  export let cachedCompilerOption: compiler.CompilerOptions | null = null;

  export function getTsConfigPath(location: string, configFile?: string): string {
    return `${location}/${configFile ?? 'tsconfig.json'}`;
  }

  /**
   * Returns a CompilerOption. If file system can not locate or validate a
   * tsconfig.json file, a default CompilerOption will be provided
   */
  export function getCompilerOptions(location: string, configFile?: string): compiler.CompilerOptions {
    cachedCompilerOption = null;

    if (cachedCompilerOption) return cachedCompilerOption;

    const { config, error } = compiler.readConfigFile(getTsConfigPath(location, configFile), compiler.sys.readFile);
    if (error) {
      throw new Error(`could not locate a tsconfig at ${location}`);
    }

    const options = compiler.parseJsonConfigFileContent(config, compiler.sys, location).options;
    cachedCompilerOption = options;

    return cachedCompilerOption;
  }
}
