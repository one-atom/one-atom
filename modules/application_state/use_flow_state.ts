/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useState } from 'react';
import { EMPTY_ARRAY } from '../miscellaneous_modules/universal_empty_constants';
import { FlowState, CurrStateTuple } from './flow_state';

export function useFlowState<T extends object>(state: FlowState<T>, triggers?: (keyof T)[]): CurrStateTuple<T> {
  const [, forceUpdate] = useState([]);

  useEffect(() => {
    return state.subscribe((changeSet) => {
      if (triggers && changeSet) {
        const shouldUpdate = triggers.find((trigger) => {
          return changeSet.has(trigger);
        });

        if (shouldUpdate) {
          forceUpdate([]);
        }

        return;
      }

      forceUpdate([]);
    });
  }, EMPTY_ARRAY);

  return state.read();
}
