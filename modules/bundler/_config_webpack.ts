import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import { Paths } from './_paths';
import { InjectProcessConfig } from './_config_inject_process';
import { BabelConfig } from './_config_babel';
import { Options as TsLoaderOptions } from 'ts-loader';

export namespace WebpackConfig {
  interface Configuration {
    paths: Paths.PathList;
    parseWithBabel: boolean;
    loadConfigPathToFile?: string;
    customEnv?: string;
  }

  interface DevelopmentConfiguration extends Configuration {
    hmr: boolean;
    port: number;
  }

  interface ProductionConfiguration extends Configuration {
    output: string;
    useBundleAnalyzer?: boolean;
  }

  function createInjectProcessEnvLike(customEnv?: string, loadConfigPathToFile?: string): InjectProcessConfig.InjectProcessConfigLike {
    const definedEnv: InjectProcessConfig.InjectProcessConfigLike = {};

    if (customEnv) {
      definedEnv[`process.env.${InjectProcessConfig.CUSTOM_ENV}`] = JSON.stringify(customEnv);
    }

    if (loadConfigPathToFile) {
      const processConfig = InjectProcessConfig.getCustomEnv(loadConfigPathToFile);

      if (processConfig !== null) {
        definedEnv[`process.env.${InjectProcessConfig.CUSTOM_GLOBAL_ENV}`] = processConfig;
      }
    }

    return definedEnv;
  }

  function extensionsArr(): Array<'.ts' | '.tsx' | '.js' | '.jsx'> {
    return ['.ts', '.tsx', '.js'];
  }

  export function development({
    hmr,
    parseWithBabel,
    paths,
    loadConfigPathToFile,
    customEnv,
  }: DevelopmentConfiguration): webpack.Configuration {
    const base: Partial<webpack.Configuration> = {
      context: paths.root,
      mode: 'development',
      output: {
        path: paths.outDir,
        filename: '[name].js',
        publicPath: '/',
      },
      devtool: 'inline-source-map',
      resolve: {
        extensions: extensionsArr(),
      },
      node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      },
      performance: {
        hints: false,
      },
    };

    function hmrPlugins(): webpack.Plugin[] {
      if (!hmr) return [];

      return [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin({
          overlay: true,
        }),
      ];
    }

    const plugins: webpack.Plugin[] = [
      new webpack.DefinePlugin(createInjectProcessEnvLike(customEnv, loadConfigPathToFile)),
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        CUSTOM_ENV: 'development',
      }),
      new ForkTsCheckerWebpackPlugin(
        parseWithBabel
          ? {
              typescript: {
                configFile: paths.tsConfig,
                diagnosticOptions: {
                  semantic: true,
                  syntactic: true,
                },
              },
            }
          : {
              typescript: {
                configFile: paths.tsConfig,
              },
            },
      ),
      new HtmlWebpackPlugin({
        template: paths.html,
        inject: true,
      }),
      ...hmrPlugins(),
    ].filter(Boolean) as webpack.Plugin[];

    if (parseWithBabel) {
      const babelrc_options = BabelConfig.createBabelrc();
      if (hmr) babelrc_options.plugins.push(require.resolve('react-refresh/babel'));

      return {
        ...base,
        plugins,
        entry: [require.resolve('react-error-overlay'), paths.main],
        module: {
          rules: [
            {
              test: /\.(ts|tsx)$/,
              use: {
                loader: 'babel-loader',
                options: babelrc_options,
              },
              exclude: /node_modules/,
            },
          ],
        },
      };
    } else {
      return {
        ...base,
        plugins,
        entry: [paths.main],
        module: {
          rules: [
            {
              test: /\.(ts|tsx)$/,
              loader: 'ts-loader',
              exclude: /node_modules/,
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
                getCustomTransformers: (_) => ({
                  before: [ReactRefreshTypeScript()],
                }),
                configFile: paths.tsConfig,
              } as TsLoaderOptions,
            },
          ],
        },
      };
    }
  }

  export function production({
    parseWithBabel,
    paths,
    loadConfigPathToFile,
    customEnv,
    output,
    useBundleAnalyzer,
  }: ProductionConfiguration): webpack.Configuration {
    const base: Partial<webpack.Configuration> = {
      context: paths.root,
      mode: 'production',
      entry: [paths.main],
      output: {
        filename: 'scripts/[name]-[hash].js',
        chunkFilename: 'scripts/[name]-[chunkhash].chunk.js',
        path: output,
        publicPath: '',
      },
      devtool: 'source-map',
      resolve: {
        extensions: extensionsArr(),
      },
      node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      },
      performance: {
        hints: false,
      },
      stats: {
        all: true,
        modules: true,
        maxModules: 15,
        chunks: true,
        errors: true,
        warnings: true,
        moduleTrace: true,
        errorDetails: true,
      },
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            extractComments: true,
            terserOptions: {
              ecma: 2019,
              mangle: {
                safari10: true,
              },
              toplevel: true,
              sourceMap: true,
            },
          }),
        ],
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
        },
      },
    };

    const plugins: webpack.Plugin[] = [
      useBundleAnalyzer &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        }),
      new webpack.DefinePlugin(createInjectProcessEnvLike(customEnv, loadConfigPathToFile)),
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        CUSTOM_ENV: 'production',
      }),
      new ForkTsCheckerWebpackPlugin(
        parseWithBabel
          ? {
              typescript: {
                configFile: paths.tsConfig,
                diagnosticOptions: {
                  semantic: true,
                  syntactic: true,
                },
              },
            }
          : {
              typescript: {
                configFile: paths.tsConfig,
              },
            },
      ),
      new HtmlWebpackPlugin({
        template: paths.html,
        inject: true,
        useShortDoctype: true,
        keepClosingSlash: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
      }),
    ].filter(Boolean) as webpack.Plugin[];

    if (parseWithBabel) {
      return {
        ...base,
        plugins,
        module: {
          rules: [
            {
              test: /\.(ts|tsx)$/,
              use: {
                loader: 'babel-loader',
                options: BabelConfig.createBabelrc(),
              },
              exclude: /node_modules/,
            },
          ],
        },
      };
    } else {
      return {
        ...base,
        plugins,
        module: {
          rules: [
            {
              test: /\.(ts|tsx)$/,
              loader: 'ts-loader',
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
                configFile: paths.tsConfig,
              } as TsLoaderOptions,
            },
          ],
        },
      };
    }
  }
}
