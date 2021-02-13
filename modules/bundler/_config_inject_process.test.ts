import { InjectProcessConfig } from './_config_inject_process';
import mock from 'mock-fs';

// This file literary pervents secvential test runs to work. The issue seems to
// resolve around fs locking files? Getting ENOENT for random files and I have
// no idea why... For now these tests will be ignored 💕💕💕💕💕💕

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

xtest('asserts that a custom config can be loaded through a json file', () => {
  {
    const env = InjectProcessConfig.getCustomEnv('json5/test_env.json5') as any;

    expect(env['deep']).toEqual('{"json5property1":"value","json5property2":"value2"}');
    expect(env['top']).toEqual(true);
  }

  {
    const env = InjectProcessConfig.getCustomEnv('standard/test_env.json') as any;

    expect(env['deep']).toEqual('{"property1":"value","property2":"value2"}');
    expect(env['top']).toEqual(true);
  }
});

xtest('asserts that a custom config can be passed as an obj', () => {
  const env = InjectProcessConfig.getCustomEnv({
    deep: {
      property1: 'value',
      property2: 'value2',
    },
    top: true,
  }) as any;

  expect(env['deep']).toEqual('{"property1":"value","property2":"value2"}');
  expect(env['top']).toEqual(true);
});
