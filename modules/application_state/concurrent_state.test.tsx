import { FC, Suspense } from 'react';
import { ConcurrentState } from './concurrent_state';
import { render } from '@testing-library/react';

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

test('asserts that concurrentState throws a promise when flow is equal to Unset', () => {
  const concurrentState = new ConcurrentState();

  expect(() => concurrentState.read()).toThrowError(Promise);
});

test('asserts that concurrentState throws a promise when flow is equal to Unset with initial state', () => {
  const concurrentState = new ConcurrentState(getTypicalState());

  expect(() => concurrentState.read()).toThrowError(Promise);
});

test('asserts that concurrentState throws a promise when flow is equal to Pending', () => {
  const concurrentState = new ConcurrentState();

  concurrentState.suspend(fakeApi.get(), (response) => {
    return {
      ...response,
      age: 20,
    };
  });

  expect(() => concurrentState.read()).toThrowError(Promise);
});

test('asserts that concurrentState throws a promise when flow is equal to Pending with initial state', () => {
  const concurrentState = new ConcurrentState(getTypicalState());

  concurrentState.suspend(fakeApi.get(), (response) => {
    return {
      ...response,
      age: 20,
    };
  });

  expect(() => concurrentState.read()).toThrowError(Promise);
});

test('asserts that a concurrentState changes state to accessible', (done) => {
  jest.useFakeTimers();
  const concurrentState = new ConcurrentState<TypicalState>();

  concurrentState.suspend(fakeApi.get(), () => {
    return {
      age: 20,
      name: 'Robin',
    };
  });

  try {
    concurrentState.read();

    throw new Error('state was accessible');
  } catch (promise: unknown | Promise<void>) {
    if (!(promise instanceof Promise)) {
      throw new Error('state was not a promise');
    }

    promise.then(() => {
      expect(concurrentState.read()).toEqual({
        age: 20,
        name: 'Robin',
      });
      done();
    });

    jest.runAllTimers();
  }
});

test('asserts that a concurrentState changes state to accessible with initial state', (done) => {
  jest.useFakeTimers();
  const concurrentState = new ConcurrentState<TypicalState>(getTypicalState());

  concurrentState.suspend(fakeApi.get(), () => {
    return {
      age: 20,
      name: 'Robin',
    };
  });

  try {
    concurrentState.read();

    throw new Error('state was accessible');
  } catch (promise: unknown | Promise<void>) {
    if (!(promise instanceof Promise)) {
      throw new Error('state was not a promise');
    }

    promise.then(() => {
      expect(concurrentState.read()).toEqual({
        age: 20,
        name: 'Robin',
      });
      done();
    });

    jest.runAllTimers();
  }
});

test('asserts that concurrentState throws the catched error', (done) => {
  jest.useFakeTimers();
  const concurrentState = new ConcurrentState<TypicalState>();

  concurrentState.suspend(fakeApi.getError(), () => {
    return {
      age: 20,
      name: 'Robin',
    };
  });

  try {
    concurrentState.read();

    throw new Error('state was accessible');
  } catch (promise: unknown | Promise<void>) {
    if (!(promise instanceof Promise)) {
      throw new Error('state was not a promise');
    }

    promise.then(() => {
      let thrownError;

      try {
        concurrentState.read();
      } catch (error: unknown) {
        thrownError = error;
      }

      expect(thrownError).toEqual({ error: 'error' });
      done();
    });

    jest.runAllTimers();
  }
});

test('asserts that concurrentState throws the catched error with initial state', (done) => {
  jest.useFakeTimers();
  const concurrentState = new ConcurrentState<TypicalState>(getTypicalState());

  concurrentState.suspend(fakeApi.getError(), () => {
    return {
      age: 20,
      name: 'Robin',
    };
  });

  try {
    concurrentState.read();

    throw new Error('state was accessible');
  } catch (promise: unknown | Promise<void>) {
    if (!(promise instanceof Promise)) {
      throw new Error('state was not a promise');
    }

    promise.then(() => {
      let thrownError;

      try {
        concurrentState.read();
      } catch (error: unknown) {
        thrownError = error;
      }

      expect(thrownError).toEqual({ error: 'error' });
      done();
    });

    jest.runAllTimers();
  }
});

const ConcurrentChild: FC<{ state: ConcurrentState<TypicalState> }> = ({ state }) => {
  const data = state.read();

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
  const concurrentState = new ConcurrentState<TypicalState>();

  const { findByText, getByText } = render(<ConcurrentParent state={concurrentState} />);
  expect(getByText(/loading/i)).toBeTruthy();

  concurrentState.suspend(fakeApi.get(), (resolve) => {
    return {
      ...resolve,
      age: 20,
    };
  });

  await findByText(/Jocke/i);
});

test('asserts that React suspense works with initial state', async () => {
  const concurrentState = new ConcurrentState(getTypicalState());

  const { findByText, getByText } = render(<ConcurrentParent state={concurrentState} />);
  expect(getByText(/loading/i)).toBeTruthy();

  concurrentState.suspend(fakeApi.get(), (resolve) => {
    return {
      ...resolve,
      age: 20,
    };
  });

  await findByText(/Jocke/i);
});
