import React from 'react';
import styled from 'styled-components';

export namespace Frame {
  export interface Prop {
    alignment?: Alignment | AlignmentStr;
    height?: number;
    width?: number;
    grow?: boolean;
    direction?: Direction | DirectionStr;
    background?: string;
    cornerRadius?: number | string;
    padding?: number | string;
    shadow?: string;
  }

  interface ElementBodyProp {
    alignment: Alignment;
    height?: number;
    width?: number;
    grow?: boolean;
    direction?: Direction | DirectionStr;
    background?: string;
    cornerRadius?: number | string;

    padding?: number | string;
    shadow?: string;
  }

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
    body: styled.div<ElementBodyProp>`
      display: flex;
      box-sizing: border-box;
      flex: ${({ grow }) => (grow ? '1' : null)};
      height: ${({ height }) => (height !== undefined ? `${height}px` : '100%')};
      width: ${({ width }) => (width !== undefined ? `${width}px` : '100%')};
      padding: ${({ padding }) => (padding !== undefined ? (padding === typeof 'string' ? padding : `${padding}px`) : '0')};
      background: ${({ background }) => background ?? null};
      border-radius: ${({ cornerRadius }) =>
        cornerRadius ? (cornerRadius === typeof 'string' ? cornerRadius : `${cornerRadius}px`) : null};
      box-shadow: ${({ shadow }) => shadow ?? null};

      ${({ direction }) => {
        if (direction !== undefined) {
          const directionParsed = typeof direction === 'string' ? convert_direction_str_to_enum(direction) : direction;

          return `flex-direction: ${directionParsed === Direction.Column ? 'column' : 'Row'};`;
        }

        return null;
      }}

      ${({ alignment, direction }) => {
        const directionParsed = typeof direction === 'string' ? convert_direction_str_to_enum(direction) : direction;

        if (directionParsed === Direction.Row) {
          switch (alignment) {
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
          switch (alignment) {
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

  export const h: React.FC<Prop> = function __kira__frame({ alignment = Alignment.Center, children, ...rest }) {
    const parsed_alignment = typeof alignment === 'string' ? convert_alignment_str_to_enum(alignment) : alignment;

    return (
      <elements.body alignment={parsed_alignment} {...rest}>
        {children}
      </elements.body>
    );
  };
}
