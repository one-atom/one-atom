import mock from 'mock-fs';
import { readJsonSync } from './_read_json_sync';

beforeEach(() => {
  mock({
    'valid.json': JSON.stringify({
      x: 'x',
    }),
    'bad.json': '---',
  });
});
afterEach(mock.restore);

test('asserts valid json file returns parsed value', () => {
  expect(readJsonSync('valid.json')).toMatchObject({
    x: 'x',
  });
});

test('asserts that no file returns null', () => {
  expect(readJsonSync('no.json')).toBe(null);
});

test('asserts that bad json file returns null', () => {
  expect(readJsonSync('bad.json')).toBe(null);
});
