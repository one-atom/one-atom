import { Fragment, FC } from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useFlowState } from './use_flow_state';
import { Flow, createFlowState, FlowState } from './flow_state';

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
  const [state, flow] = useFlowState(providedState);

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
  const state = createFlowState<TestState>({ is: false });
  const { getAllByText } = render(
    <Fragment>
      <FlowComp providedState={state} />
      <FlowComp providedState={state} />
    </Fragment>,
  );

  expect(getAllByText(FlowTexts.UNSET)).toHaveLength(2);

  act(() =>
    state.write(() => ({
      is: true,
    })),
  );
  expect(getAllByText(FlowTexts.ACCESSIBLE)).toHaveLength(2);
  expect(getAllByText('state is true')).toHaveLength(2);

  act(() =>
    state.write(() => ({
      is: false,
    })),
  );
  expect(getAllByText('state is false')).toHaveLength(2);
});
