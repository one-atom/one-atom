/* eslint-disable @typescript-eslint/ban-types */
import './_debug_hook';
import { useEffect, useState } from 'react';
import { ApplicationState } from './application_state';
import { ConcurrentState } from './concurrent_state';
import { FlowState, CurrStateTuple } from './flow_state';

export function useObservable<T extends object>(state: FlowState<T>, deps?: ReadonlyArray<keyof T>): CurrStateTuple<T>;
export function useObservable<T extends object>(state: ConcurrentState<T>, deps?: ReadonlyArray<keyof T>): Readonly<T>;
export function useObservable<T extends object>(state: ApplicationState<T>, deps?: ReadonlyArray<keyof T>): Readonly<T>;
export function useObservable<T extends object>(
  state: ApplicationState<T> | ConcurrentState<T> | FlowState<T>,
  triggers?: ReadonlyArray<keyof T>,
): CurrStateTuple<T> | Readonly<T> {
  const [, forceUpdate] = useState([]);

  useEffect(() => {
    globalThis['__one_atom_debug_hook__'].emit('add', state);

    const disposer = state.subscribe((changeSet) => {
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

    return () => {
      globalThis['__one_atom_debug_hook__'].emit('remove', state);
      disposer();
    };
  }, [state, triggers]);

  return state.read();
}
