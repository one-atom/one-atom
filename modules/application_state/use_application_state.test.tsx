import React, { Fragment } from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useApplicationState } from './use_application_state';
import { FlowState, newApplicationState, State } from './application_state';

type TestState = {
  is: boolean;
};

enum FlowTexts {
  ACCESSIBLE = 'ACCESSIBLE',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  UNSET = 'UNSET',
}

describe('use application state', () => {
  const Flow: React.FC<{ providedState: State<TestState> }> = ({ providedState }) => {
    const [state, flow] = useApplicationState(providedState);

    return (
      <Fragment>
        {flow === FlowState.ACCESSIBLE && (
          <Fragment>
            <p>{FlowTexts.ACCESSIBLE}</p>
            <p>{state.is ? 'state is true' : 'state is false'}</p>
          </Fragment>
        )}
        {flow === FlowState.ERROR && <p>{FlowTexts.ERROR}</p>}
        {flow === FlowState.PENDING && <p>{FlowTexts.PENDING}</p>}
        {flow === FlowState.UNSET && <p>{FlowTexts.UNSET}</p>}
      </Fragment>
    );
  };

  it('should rerender after mutation', () => {
    const state = newApplicationState<TestState>({ is: false });
    const { getAllByText } = render(
      <Fragment>
        <Flow providedState={state} />
        <Flow providedState={state} />
      </Fragment>,
    );

    expect(getAllByText(FlowTexts.UNSET)).toHaveLength(2);

    act(() =>
      state.mutate(() => {
        return {
          is: true,
        };
      }),
    );
    expect(getAllByText(FlowTexts.ACCESSIBLE)).toHaveLength(2);
    expect(getAllByText('state is true')).toHaveLength(2);

    act(() =>
      state.mutate(() => {
        return {
          is: false,
        };
      }),
    );
    expect(getAllByText('state is false')).toHaveLength(2);
  });
});
