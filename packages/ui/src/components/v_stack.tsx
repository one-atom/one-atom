import React from 'react';
import { HeadLessStack } from '@kira/ui-std';

/**
 * VStack
 */
export namespace VStack {
  interface Props extends Partial<Omit<HeadLessStack.Props, 'axis'>> {
    className?: string;
  }

  export const h: React.FC<Props> = function __kira__vertical_stack({ className, spacing = 0, fluid = true, children }) {
    return (
      <HeadLessStack.h spacing={spacing} axis={'Vertical'} fluid={fluid}>
        {({ childClassName, parentClassName }) => (
          <div className={`${className ?? ''} ${parentClassName}`.trim()}>
            {React.Children.map(children as React.ReactElement[], (child) => {
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
