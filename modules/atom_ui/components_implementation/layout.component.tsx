/// <reference types="../environment" />
import styled from 'styled-components';
import { OneAtomCommonPropType } from '../prop_type';

export interface OneAtomLayoutProp extends OneAtomCommonPropType {
  alignment?: AlignmentStrUnionMatrix | AlignmentStrUnionExtra;
  direction?: DirectionStrUnion;
  height?: string | number | MaxMin;
  width?: string | number | MaxMin;
  grow?: boolean;
  shrink?: boolean;
  background?: string;
  cornerRadius?: number | string;
  padding?: number | string;
  margin?: number | string;
  shadow?: string;
  box?: BoxSizingUnion;
  clip?: ClipStrUnion;
}

interface SanitizedStyleProps {
  styleAlignment: AlignmentStrUnionMatrix | AlignmentStrUnionExtra;
  styleDirection?: DirectionStrUnion;
  styleHeight?: string | number | MaxMin;
  styleWidth?: string | number | MaxMin;
  styleGrow?: boolean;
  styleShrink?: boolean;
  styleBackground?: string;
  styleCornerRadius?: number | string;
  stylePadding?: number | string;
  styleMargin?: number | string;
  styleShadow?: string;
  styleBox?: BoxSizingUnion;
  styleClip?: ClipStrUnion;
}

type StringOrNumberOrNull = string | number | null;
type MaxMin = [StringOrNumberOrNull, number?];
type DirectionStrUnion = 'row' | 'column';
type ClipStrUnion = 'y' | 'x' | 'xy' | 'hide';
type BoxSizingUnion = 'outer' | 'inner';
// prettier-ignore
type AlignmentStrUnionMatrix = 'topLeading'    | 'top'    | 'topTrailing'    |
                               'leading'       | 'center' | 'trailing'       |
                               'bottomLeading' | 'bottom' | 'bottomTrailing';
type AlignmentStrUnionExtra = 'spaceCenter' | 'spaceStart' | 'spaceEnd';

const elements = {
  body: styled.div<SanitizedStyleProps>`
    display: flex;
    box-sizing: ${({ styleBox }) => (styleBox === 'inner' ? 'border-box' : 'content-box')};
    flex: ${({ styleGrow }) => (styleGrow ? '1' : null)};
    flex-shrink: ${({ styleShrink }) => (styleShrink ? '1' : '0')};
    padding: ${({ stylePadding }) =>
      stylePadding !== undefined ? (typeof stylePadding === 'string' ? stylePadding : `${stylePadding}px`) : '0'};
    margin: ${({ styleMargin }) =>
      styleMargin !== undefined ? (typeof styleMargin === 'string' ? styleMargin : `${styleMargin}px`) : '0'};
    background: ${({ styleBackground }) => styleBackground ?? null};
    border-radius: ${({ styleCornerRadius }) =>
      styleCornerRadius ? (typeof styleCornerRadius === 'string' ? styleCornerRadius : `${styleCornerRadius}px`) : null};
    box-shadow: ${({ styleShadow }) => styleShadow ?? null};
    transition: background-color 0.3s ease;

    ${({ styleWidth }) => {
      if (typeof styleWidth === 'number') {
        return `width: ${styleWidth}px;`;
      }

      if (Array.isArray(styleWidth)) {
        const [max, min] = styleWidth as MaxMin;
        let builder = 'width: 100%;';

        if (max !== null) {
          builder += `\nmax-width: ${max}${typeof max === 'string' ? '' : 'px'};`;
        } else {
          builder = '';
        }

        if (min !== undefined) {
          builder += `\nmin-width: ${min}${typeof max === 'string' ? '' : 'px'};`;
        }

        return builder;
      }

      if (typeof styleWidth === 'string') {
        return `width: ${styleWidth};`;
      }

      return 'width: 100%;';
    }}

    ${({ styleHeight }) => {
      if (typeof styleHeight === 'number') {
        return `height: ${styleHeight}px;`;
      }

      if (Array.isArray(styleHeight)) {
        const [max, min] = styleHeight as MaxMin;
        let builder = 'height: 100%;';

        if (max !== null) {
          builder += `\nmax-height: ${max}${typeof max === 'string' ? '' : 'px'};`;
        } else {
          builder = '';
        }

        if (min !== undefined) {
          builder += `\nmin-height: ${min}${typeof max === 'string' ? '' : 'px'};`;
        }

        return builder;
      }

      if (typeof styleHeight === 'string') {
        return `height: ${styleHeight};`;
      }

      return 'height: 100%;';
    }}

    ${({ styleDirection }) => {
      if (styleDirection !== undefined) {
        return `flex-direction: ${styleDirection};`;
      }

      return null;
    }}

    ${({ styleClip }) => {
      if (styleClip === undefined) {
        return null;
      }

      if (styleClip === 'x') {
        return 'overflow-x: auto\noverflow-y: hidden;';
      }

      if (styleClip === 'y') {
        return 'overflow-y: auto;\noverflow-x: hidden;';
      }

      if (styleClip === 'xy') {
        return 'overflow: auto;';
      }

      return 'overflow: hidden;';
    }}

    ${({ styleAlignment, styleDirection }) => {
      if (styleDirection === 'row') {
        switch (styleAlignment) {
          case 'center':
            return `
            justify-content: center;
            align-items: center;
          `;
          case 'leading':
            return `
            justify-content: flex-start;
            align-items: center;
          `;
          case 'trailing':
            return `
            justify-content: flex-end;
            align-items: center;
          `;
          case 'top':
            return `
            justify-content: center;
            align-items: flex-start;
          `;
          case 'bottom':
            return `
            justify-content: center;
            align-items: flex-end;
          `;
          case 'topLeading':
            return `
            justify-content: flex-start;
            align-items: flex-start;
          `;
          case 'topTrailing':
            return `
            justify-content: flex-end;
            align-items: flex-start;
          `;
          case 'bottomLeading':
            return `
            justify-content: flex-start;
            align-items: flex-end;
          `;
          case 'bottomTrailing':
            return `
            justify-content: flex-end;
            align-items: flex-end;
          `;
          case 'spaceCenter':
            return `
            justify-content: space-between;
            align-items: center;
          `;
          case 'spaceEnd':
            return `
            justify-content: space-between;
            align-items: flex-end;
          `;
          case 'spaceStart':
            return `
            justify-content: space-between;
            align-items: flex-start;
          `;
          default:
            throw new Error('unsupported alignment');
        }
      } else {
        switch (styleAlignment) {
          case 'center':
            return `
            justify-content: center;
            align-items: center;
          `;
          case 'leading':
            return `
            justify-content: center;
            align-items: flex-start;
          `;
          case 'trailing':
            return `
            justify-content: center;
            align-items: flex-end;
          `;
          case 'top':
            return `
            justify-content: flex-start;
            align-items: center;
          `;
          case 'bottom':
            return `
            justify-content: flex-end;
            align-items: center;
          `;
          case 'topLeading':
            return `
            justify-content: flex-start;
            align-items: flex-start;
          `;
          case 'topTrailing':
            return `
            justify-content: flex-start;
            align-items: flex-end;
          `;
          case 'bottomLeading':
            return `
            justify-content: flex-end;
            align-items: flex-start;
          `;
          case 'bottomTrailing':
            return `
            justify-content: flex-end;
            align-items: flex-end;
          `;
          case 'spaceCenter':
            return `
            justify-content: space-between;
            align-items: center;
          `;
          case 'spaceEnd':
            return `
            justify-content: space-between;
            align-items: flex-end;
          `;
          case 'spaceStart':
            return `
            justify-content: space-between;
            align-items: flex-start;
          `;
          default:
            throw new Error('unsupported alignment');
        }
      }
    }}
  `,
};

export const Layout: FC<OneAtomLayoutProp> = function OneAtom_View({
  alignment = 'topLeading',
  direction = 'column',
  shrink = true,
  box = 'inner',
  background,
  cornerRadius,
  grow,
  height,
  padding,
  shadow,
  width,
  margin,
  clip,
  className,
  children,
  ...rest
}) {
  return (
    <elements.body
      styleAlignment={alignment}
      styleDirection={direction}
      styleShrink={shrink}
      styleBox={box}
      styleBackground={background}
      styleCornerRadius={cornerRadius}
      styleGrow={grow}
      styleHeight={height}
      stylePadding={padding}
      styleShadow={shadow}
      styleWidth={width}
      styleMargin={margin}
      styleClip={clip}
      className={className}
      {...rest}
    >
      {children}
    </elements.body>
  );
};
