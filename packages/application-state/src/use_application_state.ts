import { EMPTY_ARRAY } from '@kira/std';
import { IState, Wrapped } from './application_state';
import { useEffect, useState } from 'react';

export function use_application_state<T>(state: IState<T>): Wrapped<T> {
  const [, force_update] = useState([]);

  useEffect(() => {
    return state.subscribe(() => {
      force_update([]);
    });
  }, EMPTY_ARRAY);

  return state.read();
}
