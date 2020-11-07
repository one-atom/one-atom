import { EMPTY_ARRAY } from '../../std/src/index';
import { State, CurrStateTuple } from './application_state';
import { useEffect, useState } from 'react';
import { ValidStateData } from './_data_struct';

export function useApplicationState<T extends ValidStateData>(state: State<T>): CurrStateTuple<T> {
  const [, force_update] = useState([]);

  useEffect(() => {
    return state.subscribe(() => {
      force_update([]);
    });
  }, EMPTY_ARRAY);

  return state.read();
}
