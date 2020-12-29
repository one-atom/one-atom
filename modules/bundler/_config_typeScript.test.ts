import { TypeScriptConfig } from './_config_typeScript';
import mock from 'mock-fs';

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

describe('TypeScript Config', () => {
  it('should be able to parse a located tsconfig.json', () => {
    const config = TypeScriptConfig.getCompilerOptions('standard');

    expect(config.rootDir).toBe('standardSrc');
    expect(config.outDir).toBe('standardDist');
    expect(config.module).toBe('ESNext');
  });
});
