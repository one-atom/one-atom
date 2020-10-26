import React, { FC } from 'react';
import { HeadLessStack, unwrapFragment } from '@kira/ui-std';
import { KiraPropType } from '@kira/ui-std';

/**
 * HStack
 */
export namespace HStack {
  export interface Props extends Partial<Omit<HeadLessStack.Props, 'axis'>>, KiraPropType {}

  export const h: FC<Props> = function Kira_horizontal_stack({ className, spacing = 0, fluid = true, children }) {
    const flatten = unwrapFragment(children);

    return (
      <HeadLessStack.h spacing={spacing} axis={'Horizontal'} fluid={fluid}>
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
