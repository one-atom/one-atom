import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import { Paths } from './Paths';
import { WebpackConfig } from './config.Webpack';

export namespace Run {
  interface DevSpecification {
    root: string;
    customEnv?: string;
    loadConfig?: string;
    parseWithBabel?: boolean;
    hmr?: boolean;
  }

  interface ProdSpecification {
    root: string;
    customEnv?: string;
    loadConfig?: string;
    parseWithBabel?: boolean;
  }

  export function development({ root, customEnv, loadConfig, parseWithBabel, hmr }: DevSpecification): void {
    process.env.NODE_ENV = 'development';
    process.env['CUSTOM_ENV'] = customEnv ?? 'development';
    hmr = hmr ?? false;

    const paths = Paths.get(root);
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
    const webpackDevServerConfiguration: WebpackDevServer.Configuration = {
      port,
      host: 'localhost',
      clientLogLevel: 'none',
      contentBase: paths.dir,
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
      loadConfig,
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

  export function production({ root, customEnv, loadConfig, parseWithBabel }: ProdSpecification): Promise<void> {
    process.env.NODE_ENV = 'production';
    process.env['CUSTOM_ENV'] = customEnv ?? 'production';

    const paths = Paths.get(root);
    const webpackConfiguration = WebpackConfig.production({
      output: paths.outDir,
      paths,
      loadConfig,
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
