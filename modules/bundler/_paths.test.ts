import { Paths } from './_paths';
import mock from 'mock-fs';
import path from 'path';
import fs from 'fs';

// This file literary pervents secvential test runs to work. The issue seems to
// resolve around fs locking files? Getting ENOENT for random files and I have
// no idea why... For now these tests will be ignored 💕💕💕💕💕💕

beforeEach(mock.restore);

xtest('asserts that Paths can locate an expected project structure', () => {
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
  });

  const paths = Paths.get('root');

  expect(paths.rootDir).toBe(path.resolve('root/rootSrc'));
  expect(paths.outDir).toBe(path.resolve('root/rootDist'));
});

xtest('asserts that paths will throw an error when no root tsconfig is found', () => {
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
    'root/node_modules': {},
  });

  expect(() => Paths.get('root')).toThrow();
});

xtest('asserts that an optional static location is respected', () => {
  mock({
    'root/rootDist': {},
    'root/new_public': {
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

  const paths = Paths.get('root', {
    contentBase: 'new_public',
  });

  expect(fs.existsSync(paths.html)).toBeTruthy();
  expect(fs.existsSync(paths.static)).toBeTruthy();
});

xtest('asserts that an alternative index.html path can be located', () => {
  mock({
    'root/rootDist': {},
    'root/new_public': {},
    'root/alt_html': {
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

  const paths = Paths.get('root', {
    relativeIndexHTMLPath: 'alt_html',
  });

  expect(fs.existsSync(paths.html)).toBeTruthy();
});
