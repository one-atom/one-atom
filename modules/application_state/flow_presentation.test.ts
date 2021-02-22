import { FlowPresentation, Flow } from './flow_presentation';

function getTypicalState(): { name: string; age: number } {
  return {
    name: 'max',
    age: 25,
  };
}

test('asserts that flow rules are followed', () => {
  const presentation = new FlowPresentation();
  presentation.overwriteData(getTypicalState());

  // state is not explicitly accessible and should not have a value
  expect(presentation.peekState()).toMatchInlineSnapshot('undefined');

  // state is unset and should not have a value
  presentation.changeFlowTo(Flow.UNSET);
  expect(presentation.peekState()).toMatchInlineSnapshot('undefined');

  // state is pending and should not have a value
  presentation.changeFlowTo(Flow.PENDING);
  expect(presentation.peekState()).toMatchInlineSnapshot('undefined');

  // state is accessible and has value
  presentation.changeFlowTo(Flow.ACCESSIBLE);
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts that flow rules are followed with initial state', () => {
  const presentation = new FlowPresentation();
  presentation.overwriteData(getTypicalState());

  // state is not explicitly accessible and should not have a value
  expect(presentation.peekState()).toMatchInlineSnapshot('undefined');

  // state is unset and should not have a value
  presentation.changeFlowTo(Flow.UNSET);
  expect(presentation.peekState()).toMatchInlineSnapshot('undefined');

  // state is pending and should not have a value
  presentation.changeFlowTo(Flow.PENDING);
  expect(presentation.peekState()).toMatchInlineSnapshot('undefined');

  // state is accessible and has value
  presentation.changeFlowTo(Flow.ACCESSIBLE);
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts that flow rules are followed with initial state with initial state', () => {
  const presentation = new FlowPresentation({
    initialValue: getTypicalState(),
  });

  // state is not explicitly accessible and should not have a value
  expect(presentation.peekState()).toMatchInlineSnapshot('undefined');

  // state is unset and should not have a value
  presentation.changeFlowTo(Flow.UNSET);
  expect(presentation.peekState()).toMatchInlineSnapshot('undefined');

  // state is pending and should not have a value
  presentation.changeFlowTo(Flow.PENDING);
  expect(presentation.peekState()).toMatchInlineSnapshot('undefined');

  // state is accessible and has value
  presentation.changeFlowTo(Flow.ACCESSIBLE);
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts flow get initialized with designatedFlowPresentation', () => {
  const presentation = new FlowPresentation({
    designatedFlowState: Flow.ACCESSIBLE,
  });
  presentation.overwriteData(getTypicalState());

  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts flow get initialized with designatedFlowPresentation with initial state', () => {
  const presentation = new FlowPresentation({
    initialValue: getTypicalState(),
    designatedFlowState: Flow.ACCESSIBLE,
  });

  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "max",
    }
  `);
});

test('asserts that calling write mutates the state', () => {
  const presentation = new FlowPresentation();
  presentation.overwriteData(getTypicalState());

  presentation.unsafeWrite(() => ({
    name: 'kyle',
  }));
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  presentation.unsafeWrite(() => ({
    age: 28,
  }));
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  presentation.unsafeWrite(() => ({
    name: 'ezra',
    age: 22,
  }));
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 22,
      "name": "ezra",
    }
  `);
});

test('asserts that calling write mutates the state with initial state', () => {
  const presentation = new FlowPresentation({
    initialValue: getTypicalState(),
  });

  presentation.unsafeWrite(() => ({
    name: 'kyle',
  }));
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  presentation.unsafeWrite(() => ({
    age: 28,
  }));
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  presentation.unsafeWrite(() => ({
    name: 'ezra',
    age: 22,
  }));
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 22,
      "name": "ezra",
    }
  `);
});

test('asserts that calling write mutates the state', () => {
  const presentation = new FlowPresentation();
  presentation.overwriteData(getTypicalState());

  presentation.unsafeWrite(() => ({
    name: 'kyle',
  }));
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  presentation.unsafeWrite({
    age: 28,
  });
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  presentation.unsafeWrite(() => ({
    name: 'ezra',
    age: 22,
  }));
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 22,
      "name": "ezra",
    }
  `);
});

test('asserts that calling write mutates the state with initial state', () => {
  const presentation = new FlowPresentation({
    initialValue: getTypicalState(),
  });

  presentation.unsafeWrite({
    name: 'kyle',
  });
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 25,
      "name": "kyle",
    }
  `);

  presentation.unsafeWrite(() => ({
    age: 28,
  }));
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 28,
      "name": "kyle",
    }
  `);

  presentation.unsafeWrite({
    name: 'ezra',
    age: 22,
  });
  expect(presentation.peekState()).toMatchInlineSnapshot(`
    Object {
      "age": 22,
      "name": "ezra",
    }
  `);
});

test('asserts that subscription is working', () => {
  const state = new FlowPresentation();
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
  const presentation = new FlowPresentation({
    initialValue: getTypicalState(),
  });
  const fn = jest.fn();
  const disposer = presentation.subscribe(fn);

  presentation.unsafeWrite(() => ({
    name: 'kyle',
  }));
  disposer();
  presentation.unsafeWrite({
    name: 'kyle',
  });

  expect(fn).toHaveBeenCalledTimes(1);
});
