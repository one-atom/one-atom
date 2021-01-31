/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useState } from 'react';
import { ApplicationState } from './application_state';

export function useApplicationState<T extends object>(state: ApplicationState<T>, triggers?: (keyof T)[]): Readonly<T> {
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
  }, [state, triggers]);

  return state.read();
}
