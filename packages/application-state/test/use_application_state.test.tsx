import React, { Fragment } from 'react';
import { render } from '@testing-library/react';
import { use_application_state } from '../src/use_application_state';
import { IState, FlowState, new_application_state } from '../src/application_state';
import { act } from 'react-dom/test-utils';

type State = {
  is: boolean;
};

enum FlowTexts {
  ACCESSIBLE = 'ACCESSIBLE',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  UNSET = 'UNSET',
}

describe('use application state', () => {
  const Flow: React.FC<{ providedState: IState<State> }> = ({ providedState }) => {
    const [state, flow] = use_application_state(providedState);

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
    const state = new_application_state<State>({ is: false });
    const { getByText } = render(<Flow providedState={state} />);

    expect(getByText(FlowTexts.UNSET)).toBeTruthy();

    act(() =>
      state.mutate(() => {
        return {
          is: true,
        };
      }),
    );
    expect(getByText(FlowTexts.ACCESSIBLE)).toBeTruthy();
    expect(getByText('state is true')).toBeTruthy();

    act(() =>
      state.mutate(() => {
        return {
          is: false,
        };
      }),
    );
    expect(getByText('state is false')).toBeTruthy();
  });
});
