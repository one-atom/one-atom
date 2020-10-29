import { EMPTY_ARRAY } from '@kira/std';
import { State, CurrStateTuple } from './application_state';
import { useEffect, useState } from 'react';
import { ValidStateData } from './data_struct';

export function useApplicationState<T extends ValidStateData>(state: State<T>): CurrStateTuple<T> {
  const [, force_update] = useState([]);

  useEffect(() => {
    return state.subscribe(() => {
      force_update([]);
    });
  }, EMPTY_ARRAY);

  return state.read();
}
