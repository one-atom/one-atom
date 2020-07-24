import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { Paths } from './Paths';
import { KiraConfig } from './config.Kira';

export namespace WebpackConfig {
  interface DevelopmentConfiguration {
    paths: Paths.Dictionary;
    port: number;
    loadConfig?: string;
  }

  interface ProductionConfiguration {
    paths: Paths.Dictionary;
    output: string;
    loadConfig?: string;
  }

  export function development(configuration: DevelopmentConfiguration): webpack.Configuration {
    let custom_env = {};

    if (configuration.loadConfig) {
      const kira_config = KiraConfig.get_custom_env(configuration.paths.root);

      if (kira_config) {
        custom_env = kira_config;
      }
    }

    return {
      context: configuration.paths.root,
      mode: 'development',
      entry: [configuration.paths.main],
      output: {
        path: configuration.paths.outDir,
        filename: '[name].js',
        publicPath: '/',
      },
      devtool: 'cheap-module-source-map',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
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
      plugins: [
        new webpack.DefinePlugin(custom_env),
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'development',
          CUSTOM_ENV: 'development',
        }),
        new ForkTsCheckerWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
          template: configuration.paths.html,
          inject: true,
        }),
      ],
    };
  }

  export function production(configuration: ProductionConfiguration): webpack.Configuration {
    let custom_env = {};

    if (configuration.loadConfig) {
      const kira_config = KiraConfig.get_custom_env(configuration.paths.root);

      if (kira_config) {
        custom_env = kira_config;
      }
    }

    return {
      context: configuration.paths.root,
      mode: 'production',
      entry: [configuration.paths.main],
      output: {
        filename: 'scripts/[name]-[hash].js',
        chunkFilename: 'scripts/[name]-[chunkhash].chunk.js',
        path: configuration.output,
        publicPath: '',
      },
      devtool: 'source-map',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
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
      plugins: [
        new webpack.DefinePlugin(custom_env),
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'production',
          CUSTOM_ENV: 'production',
        }),
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
          template: configuration.paths.html,
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
