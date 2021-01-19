/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useState } from 'react';
import { EMPTY_ARRAY } from '../miscellaneous_modules/universal_empty_constants';
import { ApplicationState } from './application_state';

export function useApplicationState<T extends object>(state: ApplicationState<T>): Readonly<T> {
  const [, forceUpdate] = useState([]);

  useEffect(() => {
    return state.subscribe(() => {
      forceUpdate([]);
    });
  }, EMPTY_ARRAY);

  return state.read();
}
