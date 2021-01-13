/// <reference types="../environment" />
import { cloneElement, useMemo, Children } from 'react';
import { HeadLessStack, OneAtomHeadlessStackProps } from '../components_headless/headless_stack.component';
import { unwrapFragment } from '../helpers/unwrap_fragment';
import { OneAtomCommonPropType } from '../prop_type';

export interface OneAtomHStackProps extends Partial<Omit<OneAtomHeadlessStackProps, 'axis'>>, OneAtomCommonPropType {}

export const HStack: FC<OneAtomHStackProps> = function OneAtom_horizontal_stack({ className, spacing = 0, fluid = true, children }) {
  const flatten = unwrapFragment(children);
  const childLength = useMemo(() => Children.count(children), [children]);

  return (
    <HeadLessStack spacing={spacing} axis={'Horizontal'} fluid={fluid} childLength={childLength}>
      {({ parentClassName }) => (
        <div className={`${className ?? ''} ${parentClassName}`.trim()}>
          {flatten.map((child) => {
            if (child === null) return child;

            return cloneElement(child, {
              ...child.props,
              className: `${child.props.className ?? ''}`.trim(),
            });
          })}
        </div>
      )}
    </HeadLessStack>
  );
};
