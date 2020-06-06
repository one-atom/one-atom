import React, { Fragment } from 'react';
import { Portal } from './portal';
import { use_anchor_point_value } from '../hooks/use_anchor_point_value';

/**
 * HeadLessPopover
 */
export namespace HeadLessPopover {
  export interface Props {
    /** A registered anchor point */
    attachTo: string;
  }

  interface HeadLessProps {
    x: number;
    y: number;
  }

  interface InternalProps extends Props {
    children: (props: HeadLessProps) => JSX.Element;
  }

  const Inner: React.FC<InternalProps> = function __kira__headless_popover_inner({ attachTo, children }) {
    const position = use_anchor_point_value(attachTo);

    return <Fragment>{position !== null && children({ x: position.x, y: position.y })}</Fragment>;
  };

  export const h: React.FC<InternalProps> = function __kira__headless_popover({ attachTo, children }) {
    return (
      <Portal.h>
        <Inner attachTo={attachTo} children={children} />
      </Portal.h>
    );
  };
}
