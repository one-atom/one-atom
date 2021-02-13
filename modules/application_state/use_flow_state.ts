/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useState } from 'react';
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
  }, []);

  return state.read();
}
