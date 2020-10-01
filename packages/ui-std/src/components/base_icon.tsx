import React, { FC } from 'react';
import styled from 'styled-components';
import { KiraPropType } from '../prop_type';

/**
 * BaseIcon
 */
export namespace BaseIcon {
  export interface Props extends KiraPropType {
    viewBox?: string;
    rotation?: number;
    mirror?: Mirror;
    center?: boolean;
  }

  type Mirror = 'Vertical' | 'Horizontal' | true | null;

  const elements = {
    svg: styled.svg<{ rotation: number; mirror: Mirror; center: boolean }>`
      width: 1em;
      height: 1em;
      display: inline-block;
      vertical-align: text-top;
      pointer-events: none;
      fill: currentColor;
      stroke: currentColor;
      flex-shrink: 0;

      ${({ rotation, mirror, center }): string | null => {
        // Needs to concat "transform" so they won't interfere with each other
        let transform_builder = '';

        if (rotation !== 0) {
          transform_builder += `rotate(${rotation}deg) `;
        }

        if (mirror !== null) {
          const horizontal: boolean = mirror === 'Horizontal' || mirror === true || false;
          const vertical: boolean = mirror === 'Vertical' || mirror === true || false;

          if (horizontal) {
            transform_builder += 'scaleX(-1) ';
          }

          if (vertical) {
            transform_builder += 'scaleY(-1) ';
          }
        }

        if (center) {
          transform_builder += 'translateY(50%)';

          return `
            position: relative;
            top: 50%;
            transform: ${transform_builder.trim()};
            transform-origin: 50% 100%;
            vertical-align: super;
          `;
        } else if (transform_builder !== '') {
          return `transform: ${transform_builder.trim()};`;
        }

        return null;
      }}
    `,
  };

  export const h: FC<Props> = function __kira__icon({ children, viewBox, rotation, mirror, center }) {
    return (
      <elements.svg
        data-testid='svg'
        xmlns='http://www.w3.org/2000/svg'
        viewBox={viewBox ?? '0 0 512 512'}
        rotation={rotation ?? 0}
        mirror={mirror ?? null}
        center={center ?? false}
      >
        {children}
      </elements.svg>
    );
  };
}
