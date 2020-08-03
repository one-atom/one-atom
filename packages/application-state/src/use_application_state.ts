import { EMPTY_ARRAY } from '@kira/std';
import { IState, CurrStateTulip } from './application_state';
import { useEffect, useState } from 'react';
import { ValidStateData } from './data_struct';

export function use_application_state<T extends ValidStateData>(state: IState<T>): CurrStateTulip<T> {
  const [, force_update] = useState([]);

  useEffect(() => {
    return state.subscribe(() => {
      force_update([]);
    });
  }, EMPTY_ARRAY);

  return state.read();
}
