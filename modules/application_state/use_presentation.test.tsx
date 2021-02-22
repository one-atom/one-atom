import { Fragment, FC, Suspense } from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Flow, FlowPresentation } from './flow_presentation';
import { ConcurrentPresentation } from './concurrent_presentation';
import { Presentation } from './presentation';
import { usePresentation } from './use_presentation';

describe('observable with Presentation', () => {
  type TestState = {
    is: boolean;
    opt?: string;
  };

  const FlowComp: FC<{ providedState: Presentation<TestState> }> = ({ providedState }) => {
    const presentation = usePresentation(providedState);

    return <p>{presentation.is ? 'state is true' : 'state is false'}</p>;
  };

  test('asserts that components using usePresentation rerenders after write', () => {
    const presentation = new Presentation<TestState>({ is: false });
    const { getByText } = render(<FlowComp providedState={presentation} />);

    getByText(/state is false/i);

    act(() => {
      presentation.write(() => ({
        is: true,
      }));
    });
    getByText(/state is true/i);

    act(() => {
      presentation.write(() => ({
        is: false,
      }));
    });
    getByText(/state is false/i);
  });

  test('asserts that components using usePresentation only rerender when trigger matches changes', () => {
    const presentation = new Presentation<TestState>({ is: false });
    let renders = 0;

    const Child: FC<{ providedState: Presentation<TestState> }> = ({ providedState }) => {
      const state = usePresentation(providedState, ['is']);
      renders++;

      return <p>{state.is ? 'state is true' : 'state is false'}</p>;
    };

    const Parent: FC<{ providedState: Presentation<TestState> }> = ({ providedState }) => {
      usePresentation(providedState, []);
      renders++;

      return <Child providedState={providedState} />;
    };

    const { getByText } = render(<Parent providedState={presentation} />);

    getByText(/state is false/i);

    act(() => {
      presentation.write(() => ({
        is: true,
      }));
    });
    expect(renders).toEqual(3);

    act(() => {
      presentation.write(() => ({
        is: false,
      }));
    });
    expect(renders).toEqual(4);
  });
});

describe('observable with FlowPresentation', () => {
  type TestState = {
    is: boolean;
  };

  enum FlowTexts {
    ACCESSIBLE = 'ACCESSIBLE',
    ERROR = 'ERROR',
    PENDING = 'PENDING',
    UNSET = 'UNSET',
  }

  const FlowComp: FC<{ providedState: FlowPresentation<TestState> }> = ({ providedState }) => {
    const [presentation, flow] = usePresentation(providedState);

    return (
      <Fragment>
        {flow === Flow.ACCESSIBLE && (
          <Fragment>
            <p>{FlowTexts.ACCESSIBLE}</p>
            <p>{presentation.is ? 'state is true' : 'state is false'}</p>
          </Fragment>
        )}
        {flow === Flow.ERROR && <p>{FlowTexts.ERROR}</p>}
        {flow === Flow.PENDING && <p>{FlowTexts.PENDING}</p>}
        {flow === Flow.UNSET && <p>{FlowTexts.UNSET}</p>}
      </Fragment>
    );
  };

  test('asserts that components rerenders after write', () => {
    const presentation = new FlowPresentation<TestState>({
      initialValue: { is: false },
    });
    const { getAllByText } = render(
      <Fragment>
        <FlowComp providedState={presentation} />
        <FlowComp providedState={presentation} />
      </Fragment>,
    );

    expect(getAllByText(FlowTexts.UNSET)).toHaveLength(2);

    act(() =>
      presentation.unsafeWrite(() => ({
        is: true,
      })),
    );
    expect(getAllByText(FlowTexts.ACCESSIBLE)).toHaveLength(2);
    expect(getAllByText('state is true')).toHaveLength(2);

    act(() =>
      presentation.unsafeWrite(() => ({
        is: false,
      })),
    );
    expect(getAllByText('state is false')).toHaveLength(2);
  });
});

describe('observable with ConcurrentPresentation', () => {
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

  const ConcurrentChild: FC<{ state: ConcurrentPresentation<TypicalState> }> = ({ state }) => {
    const data = usePresentation(state);

    return <p>{data.name}</p>;
  };

  const ConcurrentParent: FC<{ state: ConcurrentPresentation<TypicalState> }> = ({ state }) => {
    return (
      <Suspense fallback="loading">
        <ConcurrentChild state={state} />
      </Suspense>
    );
  };

  test('asserts that React suspense works', async () => {
    const presentation = new ConcurrentPresentation(getTypicalState());

    const { findByText, getByText } = render(<ConcurrentParent state={presentation} />);
    getByText(/loading/i);

    presentation.suspend(fakeApi.get(), (resolve) => {
      return {
        ...resolve,
        age: 20,
      };
    });

    await findByText(/Jocke/i);
  });

  test('asserts that components using usePresentation rerenders after write', async () => {
    const presentation = new ConcurrentPresentation(getTypicalState());
    const { findByText, getByText } = render(<ConcurrentParent state={presentation} />);

    getByText(/loading/i);

    presentation.suspend(fakeApi.get(), (resolve) => {
      return {
        ...resolve,
        age: 20,
      };
    });

    await findByText(/Jocke/i);

    act(() => {
      presentation.unsafeWrite(() => ({
        name: 'Anton',
      }));
    });
    await findByText(/Anton/i);

    act(() => {
      presentation.unsafeWrite(() => ({
        name: 'Jocke',
      }));
    });
    await findByText(/Jocke/i);
  });

  test('asserts that components using usePresentation only rerender when trigger matches changes', async () => {
    const presentation = new ConcurrentPresentation(getTypicalState());
    let renders = 0;

    const Child: FC<{ providedState: ConcurrentPresentation<TypicalState> }> = ({ providedState }) => {
      const state = usePresentation(providedState, ['age']);
      renders++;

      return <p>age {state.age}</p>;
    };

    const Parent: FC<{ providedState: ConcurrentPresentation<TypicalState> }> = ({ providedState }) => {
      usePresentation(providedState, []);
      renders++;

      return <Child providedState={providedState} />;
    };

    const ConcurrentParent: FC<{ providedState: ConcurrentPresentation<TypicalState> }> = ({ providedState }) => {
      return (
        <Suspense fallback="loading">
          <Parent providedState={providedState} />
        </Suspense>
      );
    };

    const { getByText, findByText } = render(<ConcurrentParent providedState={presentation} />);

    presentation.suspend(fakeApi.get(), (resolve) => {
      return {
        ...resolve,
        age: 20,
      };
    });

    getByText(/loading/i);

    act(() => {
      presentation.unsafeWrite(() => ({
        age: 23,
      }));
    });
    await findByText(/age 23/i);
    expect(renders).toEqual(3);

    act(() => {
      presentation.unsafeWrite(() => ({
        age: 20,
      }));
    });
    await findByText(/age 20/i);
    expect(renders).toEqual(4);
  });
});
