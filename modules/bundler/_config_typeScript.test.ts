import { TypeScriptConfig } from './_config_typeScript';
import mock from 'mock-fs';
import * as compiler from 'typescript';

beforeEach(() => {
  mock({
    'standard/tsconfig.json': JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        jsx: 'react',
        rootDir: 'standardSrc',
        outDir: 'standardDist',
        noEmit: true,
        strict: true,
        resolveJsonModule: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        allowSyntheticDefaultImports: true,
        experimentalDecorators: true,
      },
    }),
  });
});
afterEach(mock.restore);

test('asserts it should be able to parse a tsconfig.json', () => {
  const config = TypeScriptConfig.getCompilerOptions('standard');

  expect(config.rootDir).toBe('standard/standardSrc');
  expect(config.outDir).toBe('standard/standardDist');
  expect(config.module).toBe(compiler.ModuleKind.ESNext);
});
