/* eslint-disable @typescript-eslint/no-explicit-any*/

import { EMPTY_ARRAY } from '@kira/std';
import { useEffect, useState } from 'react';
import { AnchorPointConsumer } from '../helpers/anchor_point_consumer';

type EventOutput = {
  x: number;
  y: number;
} | null;

export function use_anchor_point_value(name: string): EventOutput {
  const [position, set_position] = useState<EventOutput>(null);

  useEffect(() => {
    let disposer: () => void;

    const anchor_point_instance = AnchorPointConsumer.list.get(name);

    if (anchor_point_instance) {
      set_position(anchor_point_instance.vec_2.getAsObj());

      disposer = anchor_point_instance.onChange((vec_2) => {
        set_position(vec_2.getAsObj());
      });
    } else {
      function listener(event: any): void {
        if (event !== name) return;

        AnchorPointConsumer.notifier.off(AnchorPointConsumer.Events.Notify, listener);

        const anchor_point_instance = AnchorPointConsumer.list.get(name);
        if (anchor_point_instance === undefined) throw new Error(`Could not find an event with the name ${name}`);

        set_position(anchor_point_instance.vec_2.getAsObj());

        disposer = anchor_point_instance.onChange((vec_2) => {
          set_position(vec_2.getAsObj());
        });
      }

      AnchorPointConsumer.notifier.on(AnchorPointConsumer.Events.Notify, listener);
    }

    return () => {
      if (disposer) disposer();
    };
  }, EMPTY_ARRAY);

  return position;
}
