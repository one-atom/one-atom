/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useState } from 'react';
import { ConcurrentState } from './concurrent_state';

export function useConcurrentState<T extends object>(state: ConcurrentState<T>, triggers?: (keyof T)[]): Readonly<T> {
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
