import { newApplicationState, FlowState } from './application_state';

function get_typical_state(): { name: string; age: number } {
  return {
    name: 'max',
    age: 25,
  };
}

describe('Application State', () => {
  it('should follow the flow rules', () => {
    const state = newApplicationState(get_typical_state());

    // state is not explicitly accessible and should not have a value
    expect(state.peekState()).toMatchInlineSnapshot('undefined');

    // state is unset and should not have a value
    state.inFlow(FlowState.UNSET);
    expect(state.peekState()).toMatchInlineSnapshot('undefined');

    // state is pending and should not have a value
    state.inFlow(FlowState.PENDING);
    expect(state.peekState()).toMatchInlineSnapshot('undefined');

    // state is accessible and has value
    state.inFlow(FlowState.ACCESSIBLE);
    expect(state.peekState()).toMatchInlineSnapshot(`
      Object {
        "age": 25,
        "name": "max",
      }
    `);
  });

  it('should mutate state', () => {
    const state = newApplicationState(get_typical_state());

    state.mutate(() => {
      return {
        name: 'kyle',
      };
    });
    expect(state.peekState()).toMatchInlineSnapshot(`
      Object {
        "age": 25,
        "name": "kyle",
      }
    `);

    state.mutate(() => {
      return {
        age: 28,
      };
    });
    expect(state.peekState()).toMatchInlineSnapshot(`
      Object {
        "age": 28,
        "name": "kyle",
      }
    `);

    state.mutate(() => {
      return {
        name: 'ezra',
        age: 22,
      };
    });
    expect(state.peekState()).toMatchInlineSnapshot(`
      Object {
        "age": 22,
        "name": "ezra",
      }
    `);
  });

  it('should call subscription', () => {
    const state = newApplicationState(get_typical_state());
    const fn = jest.fn();
    const disposer = state.subscribe(fn);

    state.mutate(() => {
      return {
        name: 'kyle',
      };
    });
    disposer();
    state.mutate(() => {
      return {
        name: 'kyle',
      };
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
