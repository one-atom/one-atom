import React, { FC } from 'react';
import styled from 'styled-components';
import { KiraPropType } from '../prop_type';

export namespace View {
  export interface Prop extends KiraPropType {
    alignment?: Alignment | AlignmentStr;
    height?: number | MaxMin;
    width?: number | MaxMin;
    grow?: boolean;
    shrink?: boolean;
    direction?: Direction | DirectionStrUnion;
    background?: string;
    cornerRadius?: number | string;
    padding?: number | string;
    margin?: number | string;
    shadow?: string;
    box?: BoxSizingUnion;
    clip?: ClipStrUnion;
  }

  interface SanitizedStyleProps {
    styleAlignment: Alignment;
    styleHeight?: number | MaxMin;
    styleWidth?: number | MaxMin;
    styleGrow?: boolean;
    styleShrink?: boolean;
    styleDirection?: Direction | DirectionStrUnion;
    styleBackground?: string;
    styleCornerRadius?: number | string;
    stylePadding?: number | string;
    styleMargin?: number | string;
    styleShadow?: string;
    styleBox?: BoxSizingUnion;
    styleClip?: ClipStrUnion;
  }

  type NumberOrNull = number | null;
  // type ClockTuple = [NumberOrNull?, NumberOrNull?, NumberOrNull?, NumberOrNull?];
  type MaxMin = [NumberOrNull, number?];
  type DirectionStrUnion = 'row' | 'column';
  type ClipStrUnion = 'y' | 'x' | 'xy' | 'hide';
  type BoxSizingUnion = 'outer' | 'inner';

  export enum Direction {
    Row,
    Column,
  }

  // prettier-ignore
  type AlignmentStr = 'topLeading'    | 'top'    | 'topTrailing'    |
                      'leading'       | 'center' | 'trailing'       |
                      'bottomLeading' | 'bottom' | 'bottomTrailing';

  // prettier-ignore
  export enum Alignment {
    TopLeading,    Top,    TopTrailing,
    Leading,       Center, Trailing,
    BottomLeading, Bottom, BottomTrailing,
  }

  function convert_alignment_str_to_enum(str: AlignmentStr): Alignment {
    switch (str) {
      case 'center':
        return Alignment.Center;
      case 'top':
        return Alignment.Top;
      case 'bottom':
        return Alignment.Bottom;
      case 'leading':
        return Alignment.Leading;
      case 'trailing':
        return Alignment.Trailing;
      case 'topLeading':
        return Alignment.TopLeading;
      case 'topTrailing':
        return Alignment.TopTrailing;
      case 'bottomLeading':
        return Alignment.BottomLeading;
      case 'bottomTrailing':
        return Alignment.BottomTrailing;
      default:
        throw new Error(`Could not convert ${str} to enum`);
    }
  }

  function convert_direction_str_to_enum(str: DirectionStrUnion): Direction {
    switch (str) {
      case 'column':
        return Direction.Column;
      case 'row':
        return Direction.Row;
      default:
        throw new Error(`Could not convert ${str} to enum`);
    }
  }

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

      ${({ styleWidth }) => {
        if (typeof styleWidth === 'number') {
          return `width: ${styleWidth}px;`;
        }

        if (Array.isArray(styleWidth)) {
          const [max, min] = styleWidth as MaxMin;
          let builder = 'width: 100%;';

          if (max !== null) {
            builder += `\nmax-width: ${max}px;`;
          } else {
            builder = '';
          }

          if (min !== undefined) {
            builder += `\nmin-width: ${min}px;`;
          }

          return builder;
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
            builder += `\nmax-height: ${max}px;`;
          } else {
            builder = '';
          }

          if (min !== undefined) {
            builder += `\nmin-height: ${min}px;`;
          }

          return builder;
        }

        return 'height: 100%;';
      }}

      ${({ styleDirection }) => {
        if (styleDirection !== undefined) {
          const directionParsed = typeof styleDirection === 'string' ? convert_direction_str_to_enum(styleDirection) : styleDirection;

          return `flex-direction: ${directionParsed === Direction.Column ? 'column' : 'Row'};`;
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
        const directionParsed = typeof styleDirection === 'string' ? convert_direction_str_to_enum(styleDirection) : styleDirection;

        if (directionParsed === Direction.Row) {
          switch (styleAlignment) {
            case Alignment.Center:
              return `
              justify-content: center;
              align-items: center;
            `;
            case Alignment.Leading:
              return `
              justify-content: flex-start;
              align-items: center;
            `;
            case Alignment.Trailing:
              return `
              justify-content: flex-end;
              align-items: center;
            `;
            case Alignment.Top:
              return `
              justify-content: center;
              align-items: flex-start;
            `;
            case Alignment.Bottom:
              return `
              justify-content: center;
              align-items: flex-end;
            `;
            case Alignment.TopLeading:
              return `
              justify-content: flex-start;
              align-items: flex-start;
            `;
            case Alignment.TopTrailing:
              return `
              justify-content: flex-end;
              align-items: flex-start;
            `;
            case Alignment.BottomLeading:
              return `
              justify-content: flex-start;
              align-items: flex-end;
            `;
            case Alignment.BottomTrailing:
              return `
              justify-content: flex-end;
              align-items: flex-end;
            `;
            default:
              throw new Error('unsupported alignment');
          }
        } else {
          switch (styleAlignment) {
            case Alignment.Center:
              return `
              justify-content: center;
              align-items: center;
            `;
            case Alignment.Leading:
              return `
              justify-content: center;
              align-items: flex-start;
            `;
            case Alignment.Trailing:
              return `
              justify-content: center;
              align-items: flex-end;
            `;
            case Alignment.Top:
              return `
              justify-content: flex-start;
              align-items: center;
            `;
            case Alignment.Bottom:
              return `
              justify-content: flex-end;
              align-items: center;
            `;
            case Alignment.TopLeading:
              return `
              justify-content: flex-start;
              align-items: flex-start;
            `;
            case Alignment.TopTrailing:
              return `
              justify-content: flex-start;
              align-items: flex-end;
            `;
            case Alignment.BottomLeading:
              return `
              justify-content: flex-end;
              align-items: flex-start;
            `;
            case Alignment.BottomTrailing:
              return `
              justify-content: flex-end;
              align-items: flex-end;
            `;
            default:
              throw new Error('unsupported alignment');
          }
        }
      }}
    `,
  };

  export const h: FC<Prop> = function Kira_Frame({
    alignment = Alignment.Center,
    direction = Direction.Column,
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
  }) {
    const parsed_alignment = typeof alignment === 'string' ? convert_alignment_str_to_enum(alignment) : alignment;

    return (
      <elements.body
        styleAlignment={parsed_alignment}
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
      >
        {children}
      </elements.body>
    );
  };
}
