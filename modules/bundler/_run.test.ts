import { Run } from './_run';
import mock from 'mock-fs';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';

const webpackDevServerInitFn = jest.fn();

jest.mock(
  'webpack-dev-server',
  () =>
    class {
      constructor(...args) {
        webpackDevServerInitFn(...args);
      }

      listen(): any {
        // noop
      }
    },
);

function webpackMock(): any {
  return {};
}
webpackMock.DefinePlugin = class {
  // noop
};
webpackMock.EnvironmentPlugin = class {
  // noop
};

jest.mock('webpack', () => ({
  __esModule: true,
  default: webpackMock,
  DefinePlugin: class {},
  EnvironmentPlugin: class {},
}));

jest.mock('terser-webpack-plugin', () => ({}));
jest.mock('@pmmmwh/react-refresh-webpack-plugin', () => ({}));

beforeEach(mock.restore);

// This file literary pervents secvential test runs to work. The issue seems to
// resolve around fs locking files? Getting ENOENT for random files and I have
// no idea why... For now these tests will be ignored 💕💕💕💕💕💕

xtest('asserts Run passes down Path.Options to Paths.get function', () => {
  mock({
    'root/rootDist': {},
    'root/alt_public': {
      'index.html': 'html',
    },
    'root/rootDir/main.ts': '',
    'root/package.json': JSON.stringify({
      name: 'root',
      version: '0.0.0',
      description: 'description',
      author: 'author',
    }),
    'root/tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'es2019',
        rootDir: 'rootSrc',
        outDir: 'rootDist',
      },
    }),
    'root/node_modules': {},
  });

  Run.development({
    root: 'root',
    contentBase: 'alt_public',
  });

  expect(webpackDevServerInitFn).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining(<WebpackDevServer.Configuration>{
      contentBase: path.resolve('root/alt_public') as string,
      port: expect.any(Number) as number,
      host: expect.any(String) as string,
      clientLogLevel: expect.any(String) as string,
      disableHostCheck: expect.any(Boolean) as boolean,
      compress: expect.any(Boolean) as boolean,
      hot: expect.any(Boolean) as boolean,
      inline: expect.any(Boolean) as boolean,
      quiet: expect.any(Boolean) as boolean,
      watchContentBase: expect.any(Boolean) as boolean,
      overlay: expect.any(Boolean) as boolean,
      historyApiFallback: expect.any(Boolean) as boolean,
      https: expect.any(Boolean) as boolean,
      watchOptions: {
        ignored: /node_modules/,
      },
      setup: expect.any(Function) as () => void,
    }),
  );

  webpackDevServerInitFn.mockRestore();
});
