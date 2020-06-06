import { KiraConfig } from '../../src/config.Kira';
import mock from 'mock-fs';

beforeEach(() => {
  mock({
    'standard/kira.env.json': JSON.stringify({
      env: {
        property1: 'value',
        property2: 'value2',
      },
    }),
    'json5/kira.env.json5': JSON.stringify({
      env: {
        json5property1: 'value',
        json5property2: 'value2',
      },
    }),
  });
});
afterEach(mock.restore);

describe('TypeScript Config', () => {
  it('should be able to located kira.env.json5', () => {
    const env = KiraConfig.get_custom_env('json5') as any;

    expect(env['env']).toMatchObject({
      json5property1: 'value',
      json5property2: 'value2',
    });
  });

  it('should be able to located kira.env.json', () => {
    const env = KiraConfig.get_custom_env('standard') as any;

    expect(env['env']).toMatchObject({
      property1: 'value',
      property2: 'value2',
    });
  });
});
