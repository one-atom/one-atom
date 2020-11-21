import { nodeDependencyExits } from './_utils/mod';

export namespace BabelConfig {
  type Entry = string | [string, Record<string, unknown>];

  interface BabelRcLike {
    presets: Entry[];
    plugins: Entry[];
  }

  const presets: Entry[] = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: false,
        targets: {
          chrome: 70,
          firefox: 64,
        },
      },
    ],
    '@babel/preset-react',
    [
      '@babel/preset-typescript',
      {
        onlyRemoveTypeImports: true, // This is important for proper files watching
        allowNamespaces: true,
      },
    ],
  ];

  interface Dependency {
    id: string;
    version: string;
  }

  const dependencies: Dependency[] = [
    {
      id: '@babel/core',
      version: '^7.12.7',
    },
    {
      id: '@babel/plugin-proposal-class-properties',
      version: '^7.12.1',
    },
    {
      id: '@babel/plugin-proposal-decorators',
      version: '^7.12.1',
    },
    {
      id: '@babel/plugin-proposal-export-namespace-from',
      version: '^7.12.1',
    },
    {
      id: '@babel/plugin-transform-modules-commonjs',
      version: '^7.12.1',
    },
    {
      id: '@babel/plugin-transform-runtime',
      version: '^7.12.1',
    },
    {
      id: '@babel/plugin-transform-typescript',
      version: '^7.12.1',
    },
    {
      id: '@babel/preset-env',
      version: '^7.12.7',
    },
    {
      id: '@babel/preset-react',
      version: '^7.12.7',
    },
    {
      id: '@babel/preset-typescript',
      version: '^7.12.7',
    },
    {
      id: 'babel-plugin-styled-components',
      version: '^1.12.0',
    },
    {
      id: 'babel-plugin-transform-typescript-metadata',
      version: '^0.3.1',
    },
  ];

  const plugins: Entry[] = [
    'babel-plugin-transform-typescript-metadata',
    'babel-plugin-styled-components',
    '@babel/plugin-transform-runtime',
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-export-namespace-from',
  ];

  export function validateThatResolutionHasDependenciesInstalled(): void {
    const isUsingYarn = process.env.npm_execpath?.indexOf('yarn') === -1 ?? false;

    for (const dependency of dependencies) {
      if (!nodeDependencyExits(dependency.id)) {
        console.log(`
  "${dependency.id}" was not found in resolution, install it by running:
  $ ${isUsingYarn ? 'yarn add' : 'npm install'} ${dependency.id}
      `);

        process.exit(-1);
      }
    }
  }

  export function createBabelrc(): BabelRcLike {
    validateThatResolutionHasDependenciesInstalled();

    return {
      presets,
      plugins,
    };
  }

  export function createBabelrcForTest(): BabelRcLike {
    validateThatResolutionHasDependenciesInstalled();

    const plugins_modded: Entry[] = plugins.concat(['@babel/plugin-transform-modules-commonjs']);

    return {
      presets,
      plugins: plugins_modded,
    };
  }
}
