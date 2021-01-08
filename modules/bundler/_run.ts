import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import { Paths } from './_paths';
import { WebpackConfig } from './_config_webpack';

export namespace Run {
  interface Base {
    root: string;
    customEnv?: string;
    customConfig?: string | Record<string, unknown>;
    parseWithBabel?: boolean;
  }

  interface DevSpecification extends Paths.Option, Base {
    hmr?: boolean;
  }

  interface ProdSpecification extends Paths.Option, Base {
    useBundleAnalyzer?: boolean;
  }

  export function development({ root, customEnv, customConfig, parseWithBabel, hmr, ...rest }: DevSpecification): void {
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
      customConfig,
      customEnv,
      hmr,
      parseWithBabel: parseWithBabel ?? false,
    });
    const server = new WebpackDevServer(webpack(webpackConfiguration) as any, webpackDevServerConfiguration);

    server.listen(port, 'localhost', (error) => {
      if (error) {
        throw new Error(error.message);
      }
    });
  }

  export function production({
    root,
    customEnv,
    customConfig,
    parseWithBabel,
    useBundleAnalyzer,
    ...rest
  }: ProdSpecification): Promise<void> {
    process.env.NODE_ENV = 'production';

    const paths = Paths.get(root, rest);
    const webpackConfiguration = WebpackConfig.production({
      output: paths.outDir,
      paths,
      customConfig,
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
