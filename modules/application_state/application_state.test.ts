import { createApplicationState } from './application_state';

function getTypicalState(): { name: string; age: number } {
  return {
    name: 'max',
    age: 25,
  };
}

test('asserts that state is initialized', () => {
  const state = createApplicationState(getTypicalState());
  expect(state.read()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts that calling write mutates the state', () => {
  const state = createApplicationState(getTypicalState());

  state.write(() => ({ name: 'kyle' }));
  expect(state.read()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  state.write(() => ({
    age: 28,
  }));
  expect(state.read()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  state.write(() => ({
    name: 'ezra',
    age: 22,
  }));
  expect(state.read()).toMatchInlineSnapshot(`
    Object {
      "age": 22,
      "name": "ezra",
    }
  `);
});

test('asserts that subscription is working', () => {
  const state = createApplicationState(getTypicalState());
  const fn = jest.fn();
  const disposer = state.subscribe(fn);

  state.write(() => ({
    name: 'kyle',
  }));
  disposer();
  state.write(() => ({
    name: 'kyle',
  }));

  expect(fn).toHaveBeenCalledTimes(1);
});
