import React from 'react';
import styled from 'styled-components';

/**
 * BaseIcon
 */
export namespace BaseIcon {
  type Mirror = 'Vertical' | 'Horizontal' | true | null;

  export interface Props {
    viewBox?: string;
    rotation?: number;
    mirror?: Mirror;
  }

  const elements = {
    svg: styled.svg<{ rotation: number; mirror: Mirror }>`
      width: 1em;
      height: 1em;
      display: inline-block;
      vertical-align: text-top;
      pointer-events: none;
      fill: currentColor;
      stroke: currentColor;
      flex-shrink: 0;

      ${({ rotation, mirror }): string | null => {
        let builder = '';

        if (rotation !== 0) {
          builder += `rotate(${rotation}deg) `;
        }

        if (mirror !== null) {
          const horizontal: boolean = mirror === 'Horizontal' || mirror === true || false;
          const vertical: boolean = mirror === 'Vertical' || mirror === true || false;

          if (horizontal) {
            builder += 'scaleX(-1) ';
          }

          if (vertical) {
            builder += 'scaleY(-1) ';
          }
        }

        if (builder !== '') {
          return `transform: ${builder.trim()};`;
        }

        return null;
      }}
    `,
  };

  export const h: React.FC<Props> = function __kira__icon({ children, viewBox, rotation, mirror }) {
    return (
      <elements.svg
        data-testid='svg'
        xmlns='http://www.w3.org/2000/svg'
        viewBox={viewBox ?? '0 0 512 512'}
        rotation={rotation ?? 0}
        mirror={mirror ?? null}
      >
        {children}
      </elements.svg>
    );
  };
}
