import { FC, Suspense } from 'react';
import { render } from '@testing-library/react';
import { useConcurrentState } from './use_concurrent_state';
import { ConcurrentState, createConcurrentState } from './concurrent_state';
import { act } from 'react-dom/test-utils';

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
  const data = useConcurrentState(state);

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
  const concurrentState = createConcurrentState(getTypicalState());

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
  const concurrentState = createConcurrentState(getTypicalState());
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
  const concurrentState = createConcurrentState(getTypicalState());
  let renders = 0;

  const Child: FC<{ providedState: ConcurrentState<TypicalState> }> = ({ providedState }) => {
    const state = useConcurrentState(providedState, ['age']);
    renders++;

    return <p>age {state.age}</p>;
  };

  const Parent: FC<{ providedState: ConcurrentState<TypicalState> }> = ({ providedState }) => {
    useConcurrentState(providedState, []);
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
