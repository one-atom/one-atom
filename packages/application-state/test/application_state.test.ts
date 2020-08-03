import { new_application_state, FlowState } from '../src/application_state';

function get_typical_state() {
  return {
    name: 'max',
    age: 25,
  };
}

describe('Application State', () => {
  it('should follow the flow rules', () => {
    const state = new_application_state(get_typical_state());

    // state is not explicitly accessible and should not have a value
    expect(state.peek_state()).toMatchInlineSnapshot('undefined');

    // state is unset and should not have a value
    state.in_flow(FlowState.UNSET);
    expect(state.peek_state()).toMatchInlineSnapshot('undefined');

    // state is pending and should not have a value
    state.in_flow(FlowState.PENDING);
    expect(state.peek_state()).toMatchInlineSnapshot('undefined');

    // state is accessible and has value
    state.in_flow(FlowState.ACCESSIBLE);
    expect(state.peek_state()).toMatchInlineSnapshot(`
      Object {
        "age": 25,
        "name": "max",
      }
    `);
  });

  it('should mutate state', () => {
    const state = new_application_state(get_typical_state());

    state.mutate(() => {
      return {
        name: 'kyle',
      };
    });
    expect(state.peek_state()).toMatchInlineSnapshot(`
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
    expect(state.peek_state()).toMatchInlineSnapshot(`
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
    expect(state.peek_state()).toMatchInlineSnapshot(`
      Object {
        "age": 22,
        "name": "ezra",
      }
    `);
  });

  it('should call subscription', () => {
    const state = new_application_state(get_typical_state());
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
