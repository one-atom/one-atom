import { SynchronousPresentation } from './synchronous_presentation';

function getTypicalState(): { name: string; age: number } {
  return {
    name: 'max',
    age: 25,
  };
}

test('asserts that state is initialized', () => {
  const state = new SynchronousPresentation(getTypicalState());
  expect(state.read()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts that calling write mutates the state', () => {
  const state = new SynchronousPresentation(getTypicalState());

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

  state.write({
    name: 'ezra',
    age: 22,
  });
  expect(state.read()).toMatchInlineSnapshot(`
    Object {
      "age": 22,
      "name": "ezra",
    }
  `);
});

test('asserts that subscription is working', () => {
  const state = new SynchronousPresentation(getTypicalState());
  const fn = jest.fn();
  const disposer = state.subscribe(fn);

  state.write({
    name: 'kyle',
  });
  disposer();
  state.write(() => ({
    name: 'kyle',
  }));

  expect(fn).toHaveBeenCalledTimes(1);
});

test('asserts that changeSet works', () => {
  const state = new SynchronousPresentation(getTypicalState());
  const fn = jest.fn();
  const disposer = state.subscribe(fn);

  state.write(() => ({
    name: 'kyle',
  }));
  disposer();
  state.write({
    name: 'kyle',
  });

  expect(fn).toHaveBeenCalledTimes(1);
});
