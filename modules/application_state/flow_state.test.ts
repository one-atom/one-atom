import { createFlowState, Flow } from './flow_state';

function getTypicalState(): { name: string; age: number } {
  return {
    name: 'max',
    age: 25,
  };
}

test('asserts that flow rules are followed', () => {
  const state = createFlowState();
  state.overwriteData(getTypicalState());

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

test('asserts that flow rules are followed with initial state', () => {
  const state = createFlowState();
  state.overwriteData(getTypicalState());

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

test('asserts that flow rules are followed with initial state with initial state', () => {
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
  const state = createFlowState(undefined, Flow.ACCESSIBLE);
  state.overwriteData(getTypicalState());

  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts flow get initialized with designatedFlowState with initial state', () => {
  const state = createFlowState(getTypicalState(), Flow.ACCESSIBLE);

  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts that calling write mutates the state', () => {
  const state = createFlowState(undefined);
  state.overwriteData(getTypicalState());

  state.unsafeWrite(() => ({
    name: 'kyle',
  }));
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  state.unsafeWrite(() => ({
    age: 28,
  }));
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  state.unsafeWrite(() => ({
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

test('asserts that calling write mutates the state with initial state', () => {
  const state = createFlowState(getTypicalState());

  state.unsafeWrite(() => ({
    name: 'kyle',
  }));
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  state.unsafeWrite(() => ({
    age: 28,
  }));
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  state.unsafeWrite(() => ({
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

test('asserts that calling write mutates the state', () => {
  const state = createFlowState();
  state.overwriteData(getTypicalState());

  state.unsafeWrite(() => ({
    name: 'kyle',
  }));
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  state.unsafeWrite({
    age: 28,
  });
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  state.unsafeWrite(() => ({
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

test('asserts that calling write mutates the state with initial state', () => {
  const state = createFlowState(getTypicalState());

  state.unsafeWrite({
    name: 'kyle',
  });
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  state.unsafeWrite(() => ({
    age: 28,
  }));
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  state.unsafeWrite({
    name: 'ezra',
    age: 22,
  });
  expect(state.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 22,
      "name": "ezra",
    }
  `);
});

test('asserts that subscription is working', () => {
  const state = createFlowState();
  state.overwriteData(getTypicalState());
  const fn = jest.fn();
  const disposer = state.subscribe(fn);

  state.unsafeWrite({
    name: 'kyle',
  });
  disposer();
  state.unsafeWrite(() => ({
    name: 'kyle',
  }));

  expect(fn).toHaveBeenCalledTimes(1);
});

test('asserts that subscription is working with initial state', () => {
  const state = createFlowState(getTypicalState());
  const fn = jest.fn();
  const disposer = state.subscribe(fn);

  state.unsafeWrite(() => ({
    name: 'kyle',
  }));
  disposer();
  state.unsafeWrite({
    name: 'kyle',
  });

  expect(fn).toHaveBeenCalledTimes(1);
});
