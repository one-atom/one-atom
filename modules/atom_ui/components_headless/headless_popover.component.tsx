/// <reference types="../environment" />
import { Fragment } from 'react';
import { Portal } from '../components_implementation/portal.component';
import { useAnchorPointValue } from '../hooks/use_anchor_point_value';
import { OneAtomCommonPropType } from '../prop_type';

/**
 * HeadLessPopover
 */
export namespace HeadLessPopover {
  export interface Props extends OneAtomCommonPropType {
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

  const Inner: FC<InternalProps> = function OneAtom_HeadlessPopover_inner({ attachTo, children }) {
    const position = useAnchorPointValue(attachTo);

    return <Fragment>{position !== null && children({ x: position.x, y: position.y })}</Fragment>;
  };

  export const h: FC<InternalProps> = function HeadlessPopover({ attachTo, children }) {
    return (
      <Portal.h>
        <Inner attachTo={attachTo}>{children}</Inner>
      </Portal.h>
    );
  };
}
