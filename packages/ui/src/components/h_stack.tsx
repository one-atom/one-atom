import React from 'react';
import { HeadLessStack, unwrap_fragment } from '@kira/ui-std';

/**
 * HStack
 */
export namespace HStack {
  interface Props extends Partial<Omit<HeadLessStack.Props, 'axis'>> {
    className?: string;
  }

  export const h: React.FC<Props> = function __kira__horizontal_stack({ className, spacing = 0, fluid = true, children }) {
    const flatten = unwrap_fragment(children);

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