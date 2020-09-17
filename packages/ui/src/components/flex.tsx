import React from 'react';
import { KiraPropType } from '@kira/ui-std';
import styled from 'styled-components';

/**
 * Flex
 */
export namespace Flex {
  export type Props = {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
    alignSelf?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
    justifyContent?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    wrap?: boolean;
    grow?: number | string;
    shrink?: number;
    basis?: number | string;
  } & KiraPropType;

  // Exits to not add attributes to the dom element
  type SanitizedStyleProps = {
    styleDirection?: Props['direction'];
    styleAlignItems?: Props['alignItems'];
    styleAlignSelf?: Props['alignSelf'];
    styleJustifyContent?: Props['justifyContent'];
    styleWrap?: Props['wrap'];
    styleGrow?: Props['grow'];
    styleShrink?: Props['shrink'];
    styleBasis?: Props['basis'];
  };

  const elements = {
    flex: styled.div<SanitizedStyleProps>`
      display: flex;
      ${({ styleAlignItems }) => styleAlignItems && `align-items: ${styleAlignItems};`}
      ${({ styleJustifyContent }) => styleJustifyContent && `justify-content: ${styleJustifyContent};`}
      ${({ styleAlignSelf }) => styleAlignSelf && `align-selfs: ${styleAlignSelf};`}
      ${({ styleWrap }) => styleWrap && `flex-wrap: wrap;`}
      ${({ styleGrow }) => styleGrow && `flex-grow: ${styleGrow};`}
      ${({ styleShrink }) => styleShrink && `flex-shrink: ${styleShrink};`}
      ${({ styleBasis }) => styleBasis && `flex-basis: ${styleBasis};`}
    `,
  };

  export const h: React.FC<Props> = function __kira__flex({
    direction = 'column',
    shrink = 0,
    alignItems = 'flex-start',
    justifyContent = 'flex-start',
    wrap = false,
    grow,
    basis,
    className,
    children,
  }) {
    return (
      <elements.flex
        className={className}
        styleDirection={direction}
        styleAlignItems={alignItems}
        styleJustifyContent={justifyContent}
        styleWrap={wrap}
        styleGrow={grow}
        styleShrink={shrink}
        styleBasis={basis}
      >
        {children}
      </elements.flex>
    );
  };
}
