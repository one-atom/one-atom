import { TypeScriptConfig } from './_config_typeScript';
import mock from 'mock-fs';
import ts from 'typescript';

beforeEach(() => {
  mock({
    'standard/tsconfig.json': JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        target: 'es2019',
        jsx: 'react',
        rootDir: 'standardSrc',
        outDir: 'standardDist',
        baseUrl: 'standardBaseUrl',
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

describe('TypeScript Config', () => {
  it('should be able to parse a located tsconfig.json', () => {
    const config = TypeScriptConfig.getCompilerOptions('standard');

    expect(config.rootDir).toBe('standardSrc');
    expect(config.outDir).toBe('standardDist');
    expect(config.target).toBe(ts.ScriptTarget.ES2019);
    expect(config.module).toBe('ESNext');
    expect(config.baseUrl).toBe('standardBaseUrl');
  });
});
