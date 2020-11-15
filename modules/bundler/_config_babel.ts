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

  const plugins: Entry[] = [
    'babel-plugin-transform-typescript-metadata',
    'babel-plugin-styled-components',
    '@babel/plugin-transform-runtime',
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-export-namespace-from',
  ];

  export function createBabelrc(): BabelRcLike {
    return {
      presets,
      plugins,
    };
  }

  export function createBabelrcForTest(): BabelRcLike {
    const plugins_modded: Entry[] = plugins.concat(['@babel/plugin-transform-modules-commonjs']);

    return {
      presets,
      plugins: plugins_modded,
    };
  }
}
