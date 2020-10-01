import React, { FC } from 'react';
import styled from 'styled-components';
import { KiraPropType } from '@kira/ui-std';

export namespace Frame {
  export interface Prop extends KiraPropType {
    alignment?: Alignment | AlignmentStr;
    height?: number | MaxMin;
    width?: number | MaxMin;
    grow?: boolean;
    direction?: Direction | DirectionStr;
    background?: string;
    cornerRadius?: number | string;
    padding?: number | string;
    shadow?: string;
  }

  interface SanitizedStyleProps {
    styleAlignment: Alignment;
    styleHeight?: number | MaxMin;
    styleWidth?: number | MaxMin;
    styleGrow?: boolean;
    styleDirection?: Direction | DirectionStr;
    styleBackground?: string;
    styleCornerRadius?: number | string;

    stylePadding?: number | string;
    styleShadow?: string;
  }
  type NumberOrNull = number | null;
  // type ClockTuple = [NumberOrNull?, NumberOrNull?, NumberOrNull?, NumberOrNull?];
  type MaxMin = [NumberOrNull, number?];

  type DirectionStr = 'row' | 'column';

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

  function convert_direction_str_to_enum(str: DirectionStr): Direction {
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
      box-sizing: border-box;
      flex: ${({ styleGrow }) => (styleGrow ? '1' : null)};
      padding: ${({ stylePadding }) =>
        stylePadding !== undefined ? (stylePadding === typeof 'string' ? stylePadding : `${stylePadding}px`) : '0'};
      background: ${({ styleBackground }) => styleBackground ?? null};
      border-radius: ${({ styleCornerRadius }) =>
        styleCornerRadius ? (styleCornerRadius === typeof 'string' ? styleCornerRadius : `${styleCornerRadius}px`) : null};
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

  export const h: FC<Prop> = function __kira__frame({
    alignment = Alignment.Center,
    direction = Direction.Column,
    background,
    cornerRadius,
    grow,
    height,
    padding,
    shadow,
    width,
    className,
    children,
  }) {
    const parsed_alignment = typeof alignment === 'string' ? convert_alignment_str_to_enum(alignment) : alignment;

    return (
      <elements.body
        styleAlignment={parsed_alignment}
        styleDirection={direction}
        styleBackground={background}
        styleCornerRadius={cornerRadius}
        styleGrow={grow}
        styleHeight={height}
        stylePadding={padding}
        styleShadow={shadow}
        styleWidth={width}
        className={className}
      >
        {children}
      </elements.body>
    );
  };
}
