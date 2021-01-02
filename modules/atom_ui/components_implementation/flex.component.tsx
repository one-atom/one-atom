/// <reference types="../environment" />
import { OneAtomCommonPropType } from '../prop_type';
import styled from 'styled-components';

export type OneAtomFlexProps = {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  alignSelf?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  justifyContent?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  wrap?: boolean;
  grow?: number | string;
  shrink?: number;
  basis?: number | string;
  applySize?: boolean;
} & OneAtomCommonPropType;

// Exits to not add attributes to the dom element
type SanitizedStyleProps = {
  styleDirection?: OneAtomFlexProps['direction'];
  styleAlignItems?: OneAtomFlexProps['alignItems'];
  styleAlignSelf?: OneAtomFlexProps['alignSelf'];
  styleJustifyContent?: OneAtomFlexProps['justifyContent'];
  styleWrap?: OneAtomFlexProps['wrap'];
  styleGrow?: OneAtomFlexProps['grow'];
  styleShrink?: OneAtomFlexProps['shrink'];
  styleBasis?: OneAtomFlexProps['basis'];
  applySize?: OneAtomFlexProps['applySize'];
};

const elements = {
  flex: styled.div<SanitizedStyleProps>`
    display: flex;
    ${({ applySize }) => applySize && `width: 100%;\nheight: 100%;`}
    ${({ styleAlignItems }) => styleAlignItems && `align-items: ${styleAlignItems};`}
    ${({ styleJustifyContent }) => styleJustifyContent && `justify-content: ${styleJustifyContent};`}
    ${({ styleAlignSelf }) => styleAlignSelf && `align-selfs: ${styleAlignSelf};`}
    ${({ styleWrap }) => styleWrap && `flex-wrap: wrap;`}
    ${({ styleGrow }) => styleGrow && `flex-grow: ${styleGrow};`}
    ${({ styleShrink }) => styleShrink && `flex-shrink: ${styleShrink};`}
    ${({ styleBasis }) => styleBasis && `flex-basis: ${styleBasis};`}
  `,
};

export const Flex: FC<OneAtomFlexProps> = function OneAtom_Flex({
  grow,
  basis,
  className,
  children,
  shrink = 0,
  wrap = false,
  applySize = true,
  direction = 'column',
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
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
      applySize={applySize}
    >
      {children}
    </elements.flex>
  );
};
