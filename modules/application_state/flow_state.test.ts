import { createFlowState, Flow } from './flow_state';

function getTypicalState(): { name: string; age: number } {
  return {
    name: 'max',
    age: 25,
  };
}

test('asserts that flow rules are followed', () => {
  const state = createFlowState(getTypicalState());

  // state is not explicitly accessible and should not have a value
  expect(state.peekState()).toMatchInlineSnapshot('undefined');

  // state is unset and should not have a value
  state.changeFlowTo(Flow.UNSET);
  expect(state.peekState()).toMatchInlineSnapshot('undefined');

  // state is pending and should not have a value
  state.changeFlowTo(Flow.PENDING);
  expect(state.peekState()).toMatchInlineSnapshot('undefined');

  // state is accessible and has value
  state.changeFlowTo(Flow.ACCESSIBLE);
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts flow get initialized with designatedFlowState', () => {
  const state = createFlowState(getTypicalState(), Flow.ACCESSIBLE);

  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts that calling write mutates the state', () => {
  const state = createFlowState(getTypicalState());

  state.write(() => ({
    name: 'kyle',
  }));
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  state.write(() => ({
    age: 28,
  }));
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  state.write(() => ({
    name: 'ezra',
    age: 22,
  }));
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 22,
      "name": "ezra",
    }
  `);
});

test('asserts that subscription is working', () => {
  const state = createFlowState(getTypicalState());
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
