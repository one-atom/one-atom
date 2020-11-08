import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { Paths } from './Paths';
import { KiraConfig } from './config.Kira';
import { BabelConfig } from './config.Babel';

export namespace WebpackConfig {
  interface DevelopmentConfiguration {
    paths: Paths.Dictionary;
    parseWithBabel: boolean;
    hmr: boolean;
    port: number;
    loadConfigPathToFile?: string;
    customEnv?: string;
  }

  interface ProductionConfiguration {
    paths: Paths.Dictionary;
    parseWithBabel: boolean;
    output: string;
    loadConfigPathToFile?: string;
    customEnv?: string;
  }

  function createKiraConfigLike(customEnv?: string, loadConfigPathToFile?: string): KiraConfig.KiraConfigLike {
    const defined_env: KiraConfig.KiraConfigLike = {};

    if (customEnv) {
      defined_env[`process.env.${KiraConfig.CUSTOM_ENV}`] = JSON.stringify(customEnv);
    }

    if (loadConfigPathToFile) {
      const kira_config = KiraConfig.get_custom_env(loadConfigPathToFile);

      if (kira_config !== null) {
        defined_env[`process.env.${KiraConfig.CUSTOM_GLOBAL_ENV}`] = kira_config;
      }
    }

    return defined_env;
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
      devtool: 'cheap-module-source-map',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
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

    if (parseWithBabel) {
      const babelrc_options = BabelConfig.create_babelrc();
      if (hmr) babelrc_options.plugins.push(require.resolve('react-refresh/babel'));

      return {
        ...base,
        entry: [require.resolve('react-error-overlay'), paths.main],
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              use: {
                loader: 'babel-loader',
                options: babelrc_options,
              },
              exclude: /node_modules/,
            },
          ],
        },
        plugins: [
          new webpack.DefinePlugin(createKiraConfigLike(customEnv, loadConfigPathToFile)),
          new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            CUSTOM_ENV: 'development',
          }),
          new ForkTsCheckerWebpackPlugin({
            typescript: {
              diagnosticOptions: {
                semantic: true,
                syntactic: true,
              },
            },
          }),
          hmr &&
            new ReactRefreshWebpackPlugin({
              overlay: true,
            }),
          new HtmlWebpackPlugin({
            template: paths.html,
            inject: true,
          }),
        ].filter(Boolean) as webpack.Plugin[],
      };
    } else {
      return {
        ...base,
        entry: [paths.main],
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
              },
            },
          ],
        },
        plugins: [
          hmr && new webpack.HotModuleReplacementPlugin(),
          new webpack.DefinePlugin(createKiraConfigLike(customEnv, loadConfigPathToFile)),
          new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            CUSTOM_ENV: 'development',
          }),
          new ForkTsCheckerWebpackPlugin(),
          new HtmlWebpackPlugin({
            template: paths.html,
            inject: true,
          }),
        ].filter(Boolean) as webpack.Plugin[],
      };
    }
  }

  export function production({
    parseWithBabel,
    paths,
    loadConfigPathToFile,
    customEnv,
    output,
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
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
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

    if (parseWithBabel) {
      return {
        ...base,
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              use: {
                loader: 'babel-loader',
                options: BabelConfig.create_babelrc(),
              },
              exclude: /node_modules/,
            },
          ],
        },
        plugins: [
          new webpack.DefinePlugin(createKiraConfigLike(customEnv, loadConfigPathToFile)),
          new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            CUSTOM_ENV: 'production',
          }),
          new ForkTsCheckerWebpackPlugin({
            typescript: {
              diagnosticOptions: {
                semantic: true,
                syntactic: true,
              },
            },
          }),
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
        ],
      };
    } else {
      return {
        ...base,
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
              },
            },
          ],
        },
        plugins: [
          new webpack.DefinePlugin(createKiraConfigLike(customEnv, loadConfigPathToFile)),
          new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            CUSTOM_ENV: 'production',
          }),
          new ForkTsCheckerWebpackPlugin(),
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
        ],
      };
    }
  }
}
