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
  expect(readJsonSync('valid.json')[0]).toMatchObject({
    x: 'x',
  });
});

test('asserts that no file returns null', () => {
  const returnedValue = readJsonSync('no.json');
  expect(returnedValue[0]).toBe(null);
  expect(returnedValue[1]).toBe(0);
});

test('asserts that bad json file returns null', () => {
  const returnedValue = readJsonSync('bad.json');
  expect(returnedValue[0]).toBe(null);
  expect(returnedValue[1]).toBe(-1);
});
