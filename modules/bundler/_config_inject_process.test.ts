import { InjectProcessConfig } from './_config_inject_process';
import mock from 'mock-fs';

beforeEach(() => {
  mock({
    'standard/test_env.json': JSON.stringify({
      deep: {
        property1: 'value',
        property2: 'value2',
      },
      top: true,
    }),
    'json5/test_env.json5': JSON.stringify({
      deep: {
        json5property1: 'value',
        json5property2: 'value2',
      },
      top: true,
    }),
  });
});
afterEach(mock.restore);

describe('TypeScript Config', () => {
  it('should be able to located test_env.env.json5', () => {
    const env = InjectProcessConfig.getCustomEnv('json5/test_env.json5') as any;

    expect(env['deep']).toEqual('{"json5property1":"value","json5property2":"value2"}');
    expect(env['top']).toEqual(true);
  });

  it('should be able to located test_env.env.json', () => {
    const env = InjectProcessConfig.getCustomEnv('standard/test_env.json') as any;

    expect(env['deep']).toEqual('{"property1":"value","property2":"value2"}');
    expect(env['top']).toEqual(true);
  });
});
