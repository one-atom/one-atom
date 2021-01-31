import { FC } from 'react';
import { render } from '@testing-library/react';
import { useApplicationState } from './use_application_state';
import { ApplicationState, createApplicationState } from './application_state';
import { act } from 'react-dom/test-utils';

type TestState = {
  is: boolean;
  opt?: string;
};

const FlowComp: FC<{ providedState: ApplicationState<TestState> }> = ({ providedState }) => {
  const state = useApplicationState(providedState);

  return <p>{state.is ? 'state is true' : 'state is false'}</p>;
};

test('asserts that components using useApplicationState rerenders after write', () => {
  const state = createApplicationState<TestState>({ is: false });
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
  const state = createApplicationState<TestState>({ is: false });
  let renders = 0;

  const Child: FC<{ providedState: ApplicationState<TestState> }> = ({ providedState }) => {
    const state = useApplicationState(providedState, ['is']);
    renders++;

    return <p>{state.is ? 'state is true' : 'state is false'}</p>;
  };

  const Parent: FC<{ providedState: ApplicationState<TestState> }> = ({ providedState }) => {
    useApplicationState(providedState, []);
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
