import React, { Fragment } from 'react';
import { Portal } from '../components_implementation/portal';
import { useAnchorPointValue } from '../hooks/use_anchor_point_value';
import { KiraPropType } from '../prop_type';

/**
 * HeadLessPopover
 */
export namespace HeadLessPopover {
  export interface Props extends KiraPropType {
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

  const Inner: React.FC<InternalProps> = function Kira_HeadlessPopover_inner({ attachTo, children }) {
    const position = useAnchorPointValue(attachTo);

    return <Fragment>{position !== null && children({ x: position.x, y: position.y })}</Fragment>;
  };

  export const h: React.FC<InternalProps> = function HeadlessPopover({ attachTo, children }) {
    return (
      <Portal.h>
        <Inner attachTo={attachTo}>{children}</Inner>
      </Portal.h>
    );
  };
}
