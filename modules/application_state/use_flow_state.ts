import { useEffect, useState } from 'react';
import { EMPTY_ARRAY } from '../miscellaneous_modules/universal_empty_constants';
import { FlowState, CurrStateTuple } from './flow_state';
import { ValidStateData } from './_data_struct';

export function useApplicationState<T extends ValidStateData>(state: FlowState<T>): CurrStateTuple<T> {
  const [, forceUpdate] = useState([]);

  useEffect(() => {
    return state.subscribe(() => {
      forceUpdate([]);
    });
  }, EMPTY_ARRAY);

  return state.read();
}
