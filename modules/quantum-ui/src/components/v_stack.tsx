import React, { FC } from 'react';
import { HeadLessStack, unwrapFragment, KiraPropType } from '../../../ui-std/src/index';

/**
 * VStack
 */
export namespace VStack {
  export interface Props extends Partial<Omit<HeadLessStack.Props, 'axis'>>, KiraPropType {}

  export const h: FC<Props> = function Kira_Vertical_stack({ className, spacing = 0, fluid = true, children }) {
    const flatten = unwrapFragment(children);

    return (
      <HeadLessStack.h spacing={spacing} axis={'Vertical'} fluid={fluid}>
        {({ childClassName, parentClassName }) => (
          <div className={`${className ?? ''} ${parentClassName}`.trim()}>
            {flatten.map((child) => {
              if (child === null) return child;

              return React.cloneElement(child, {
                ...child.props,
                className: `${child.props.className ?? ''} ${childClassName}`.trim(),
              });
            })}
          </div>
        )}
      </HeadLessStack.h>
    );
  };
}
