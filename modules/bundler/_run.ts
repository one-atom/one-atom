import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import { Paths } from './_paths';
import { WebpackConfig } from './_config_webpack';

export namespace Run {
  interface DevSpecification extends Paths.Option {
    root: string;
    customEnv?: string;
    loadConfigPathToFile?: string;
    parseWithBabel?: boolean;
    hmr?: boolean;
  }

  interface ProdSpecification extends Paths.Option {
    root: string;
    customEnv?: string;
    loadConfigPathToFile?: string;
    parseWithBabel?: boolean;
    useBundleAnalyzer?: boolean;
  }

  export function development({ root, customEnv, loadConfigPathToFile, parseWithBabel, hmr, ...rest }: DevSpecification): void {
    process.env.NODE_ENV = 'development';
    hmr = hmr ?? false;

    const paths = Paths.get(root, rest);
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
    const webpackDevServerConfiguration: WebpackDevServer.Configuration = {
      port,
      host: 'localhost',
      clientLogLevel: 'none',
      contentBase: paths.static,
      disableHostCheck: true,
      compress: true,
      hot: hmr,
      inline: hmr,
      quiet: true,
      watchContentBase: true,
      overlay: false,
      historyApiFallback: true,
      https: false,
      watchOptions: {
        ignored: /node_modules/,
      },
      setup(app) {
        if (parseWithBabel) {
          // This lets us open files from the runtime error overlay.
          app.use(errorOverlayMiddleware());
        }
      },
    };

    const webpackConfiguration = WebpackConfig.development({
      port,
      paths,
      loadConfigPathToFile,
      customEnv,
      hmr,
      parseWithBabel: parseWithBabel ?? false,
    });
    const server = new WebpackDevServer(webpack(webpackConfiguration), webpackDevServerConfiguration);

    server.listen(port, 'localhost', (error) => {
      if (error) {
        throw new Error(error.message);
      }
    });
  }

  export function production({
    root,
    customEnv,
    loadConfigPathToFile,
    parseWithBabel,
    useBundleAnalyzer,
    ...rest
  }: ProdSpecification): Promise<void> {
    process.env.NODE_ENV = 'production';

    const paths = Paths.get(root, rest);
    const webpackConfiguration = WebpackConfig.production({
      output: paths.outDir,
      paths,
      loadConfigPathToFile,
      customEnv,
      useBundleAnalyzer,
      parseWithBabel: parseWithBabel ?? false,
    });
    const compiler = webpack(webpackConfiguration);

    return new Promise((resolve, reject) => {
      compiler.run((_, stats) => {
        if (stats.compilation.errors.length > 0) {
          return reject(stats.compilation.errors);
        }

        resolve();
      });
    });
  }
}
