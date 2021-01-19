/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useState } from 'react';
import { EMPTY_ARRAY } from '../miscellaneous_modules/universal_empty_constants';
import { ConcurrentState } from './concurrent_state';

export function useConcurrentState<T extends object>(state: ConcurrentState<T>): Readonly<T> {
  const [, forceUpdate] = useState([]);

  useEffect(() => {
    return state.subscribe(() => {
      forceUpdate([]);
    });
  }, EMPTY_ARRAY);

  return state.read();
}
