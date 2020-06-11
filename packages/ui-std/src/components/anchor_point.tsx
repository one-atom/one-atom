import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AnchorPointConsumer } from '../helpers/anchor_point_consumer';
import { EMPTY_ARRAY } from '../constants';

/**
 * AnchorPoint
 */
export namespace AnchorPoint {
  const elements = {
    e: styled.div`
      display: contents;
    `,
  };

  interface Props {
    /** Name of registered anchor point */
    name: string;

    /** String containing multiple "-" and one "x" */
    top?: string;

    /** String containing multiple "-" and one "x" */
    left?: string;
  }

  export const h: React.FC<Props> = function __kira__anchor_point({ name, top, left, children }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref.current === null) {
        throw new Error('no!');
      }

      if (ref.current.parentNode === null) {
        throw new Error('no!');
      }

      AnchorPointConsumer.add({
        name,
        ref: ref.current.parentNode as HTMLElement,
        top,
        left,
      });

      return () => {
        AnchorPointConsumer.destroy(name);
      };
    }, EMPTY_ARRAY);

    return <elements.e ref={ref}>{children}</elements.e>;
  };
}
