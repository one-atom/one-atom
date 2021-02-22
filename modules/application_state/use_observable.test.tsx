import { Fragment, FC, Suspense } from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Flow, FlowState } from './flow_state';
import { ConcurrentState } from './concurrent_state';
import { ApplicationState } from './application_state';
import { useObservable } from './use_observable';

describe('observable with applicationState', () => {
  type TestState = {
    is: boolean;
    opt?: string;
  };

  const FlowComp: FC<{ providedState: ApplicationState<TestState> }> = ({ providedState }) => {
    const state = useObservable(providedState);

    return <p>{state.is ? 'state is true' : 'state is false'}</p>;
  };

  test('asserts that components using useApplicationState rerenders after write', () => {
    const state = new ApplicationState<TestState>({ is: false });
    const { getByText } = render(<FlowComp providedState={state} />);

    getByText(/state is false/i);

    act(() => {
      state.write(() => ({
        is: true,
      }));
    });
    getByText(/state is true/i);

    act(() => {
      state.write(() => ({
        is: false,
      }));
    });
    getByText(/state is false/i);
  });

  test('asserts that components using useApplicationState only rerender when trigger matches changes', () => {
    const state = new ApplicationState<TestState>({ is: false });
    let renders = 0;

    const Child: FC<{ providedState: ApplicationState<TestState> }> = ({ providedState }) => {
      const state = useObservable(providedState, ['is']);
      renders++;

      return <p>{state.is ? 'state is true' : 'state is false'}</p>;
    };

    const Parent: FC<{ providedState: ApplicationState<TestState> }> = ({ providedState }) => {
      useObservable(providedState, []);
      renders++;

      return <Child providedState={providedState} />;
    };

    const { getByText } = render(<Parent providedState={state} />);

    getByText(/state is false/i);

    act(() => {
      state.write(() => ({
        is: true,
      }));
    });
    expect(renders).toEqual(3);

    act(() => {
      state.write(() => ({
        is: false,
      }));
    });
    expect(renders).toEqual(4);
  });
});

describe('observable with flowState', () => {
  type TestState = {
    is: boolean;
  };

  enum FlowTexts {
    ACCESSIBLE = 'ACCESSIBLE',
    ERROR = 'ERROR',
    PENDING = 'PENDING',
    UNSET = 'UNSET',
  }

  const FlowComp: FC<{ providedState: FlowState<TestState> }> = ({ providedState }) => {
    const [state, flow] = useObservable(providedState);

    return (
      <Fragment>
        {flow === Flow.ACCESSIBLE && (
          <Fragment>
            <p>{FlowTexts.ACCESSIBLE}</p>
            <p>{state.is ? 'state is true' : 'state is false'}</p>
          </Fragment>
        )}
        {flow === Flow.ERROR && <p>{FlowTexts.ERROR}</p>}
        {flow === Flow.PENDING && <p>{FlowTexts.PENDING}</p>}
        {flow === Flow.UNSET && <p>{FlowTexts.UNSET}</p>}
      </Fragment>
    );
  };

  test('asserts that components rerenders after write', () => {
    const state = new FlowState<TestState>({
      initialState: { is: false },
    });
    const { getAllByText } = render(
      <Fragment>
        <FlowComp providedState={state} />
        <FlowComp providedState={state} />
      </Fragment>,
    );

    expect(getAllByText(FlowTexts.UNSET)).toHaveLength(2);

    act(() =>
      state.unsafeWrite(() => ({
        is: true,
      })),
    );
    expect(getAllByText(FlowTexts.ACCESSIBLE)).toHaveLength(2);
    expect(getAllByText('state is true')).toHaveLength(2);

    act(() =>
      state.unsafeWrite(() => ({
        is: false,
      })),
    );
    expect(getAllByText('state is false')).toHaveLength(2);
  });
});

describe('observable with concurrentState', () => {
  type TypicalState = {
    name: string;
    age: number;
  };

  function getTypicalState(): TypicalState {
    return {
      name: 'max',
      age: 25,
    };
  }

  const fakeApi = {
    get: () =>
      new Promise<{ name: string }>((resolve) => {
        setTimeout(() => {
          resolve({
            name: 'Jocke',
          });
        }),
          10;
      }),
    getError: () =>
      new Promise<{ name: string }>((_, reject) => {
        setTimeout(() => {
          reject({
            error: 'error',
          });
        }),
          10;
      }),
  };

  const ConcurrentChild: FC<{ state: ConcurrentState<TypicalState> }> = ({ state }) => {
    const data = useObservable(state);

    return <p>{data.name}</p>;
  };

  const ConcurrentParent: FC<{ state: ConcurrentState<TypicalState> }> = ({ state }) => {
    return (
      <Suspense fallback="loading">
        <ConcurrentChild state={state} />
      </Suspense>
    );
  };

  test('asserts that React suspense works', async () => {
    const concurrentState = new ConcurrentState(getTypicalState());

    const { findByText, getByText } = render(<ConcurrentParent state={concurrentState} />);
    getByText(/loading/i);

    concurrentState.suspend(fakeApi.get(), (resolve) => {
      return {
        ...resolve,
        age: 20,
      };
    });

    await findByText(/Jocke/i);
  });

  test('asserts that components using useConcurrentState rerenders after write', async () => {
    const concurrentState = new ConcurrentState(getTypicalState());
    const { findByText, getByText } = render(<ConcurrentParent state={concurrentState} />);

    getByText(/loading/i);

    concurrentState.suspend(fakeApi.get(), (resolve) => {
      return {
        ...resolve,
        age: 20,
      };
    });

    await findByText(/Jocke/i);

    act(() => {
      concurrentState.unsafeWrite(() => ({
        name: 'Anton',
      }));
    });
    await findByText(/Anton/i);

    act(() => {
      concurrentState.unsafeWrite(() => ({
        name: 'Jocke',
      }));
    });
    await findByText(/Jocke/i);
  });

  test('asserts that components using useConcurrentState only rerender when trigger matches changes', async () => {
    const concurrentState = new ConcurrentState(getTypicalState());
    let renders = 0;

    const Child: FC<{ providedState: ConcurrentState<TypicalState> }> = ({ providedState }) => {
      const state = useObservable(providedState, ['age']);
      renders++;

      return <p>age {state.age}</p>;
    };

    const Parent: FC<{ providedState: ConcurrentState<TypicalState> }> = ({ providedState }) => {
      useObservable(providedState, []);
      renders++;

      return <Child providedState={providedState} />;
    };

    const ConcurrentParent: FC<{ providedState: ConcurrentState<TypicalState> }> = ({ providedState }) => {
      return (
        <Suspense fallback="loading">
          <Parent providedState={providedState} />
        </Suspense>
      );
    };

    const { getByText, findByText } = render(<ConcurrentParent providedState={concurrentState} />);

    concurrentState.suspend(fakeApi.get(), (resolve) => {
      return {
        ...resolve,
        age: 20,
      };
    });

    getByText(/loading/i);

    act(() => {
      concurrentState.unsafeWrite(() => ({
        age: 23,
      }));
    });
    await findByText(/age 23/i);
    expect(renders).toEqual(3);

    act(() => {
      concurrentState.unsafeWrite(() => ({
        age: 20,
      }));
    });
    await findByText(/age 20/i);
    expect(renders).toEqual(4);
  });
});
