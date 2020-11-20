import { Paths } from './_paths';
import mock from 'mock-fs';
import path from 'path';

beforeEach(() => {
  mock({
    'root/rootDist': {},
    'root/public': {
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

    'noTsConfig/rootDist': {},
    'noTsConfig/public': {
      'index.html': 'html',
    },
    'noTsConfig/rootDir/main.ts': '',
    'noTsConfig/package.json': JSON.stringify({
      name: 'root',
      version: '0.0.0',
      description: 'description',
      author: 'author',
    }),
    'noTsConfig/node_modules': {},
  });
});
afterEach(mock.restore);

describe('Paths', () => {
  it('should be able to locate a valid project structure', () => {
    const paths = Paths.get('root');

    expect(paths.rootDir).toBe(path.resolve('root/rootSrc'));
    expect(paths.outDir).toBe(path.resolve('root/rootDist'));
  });

  it('should throw if no tsconfig was found', () => {
    expect(() => Paths.get('noTsConfig')).toThrow();
  });
});
