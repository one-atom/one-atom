import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { KiraPropType } from '../../../ui-std/src/index';

/**
 * change this
 */
export namespace Shimmer {
  export interface Props extends KiraPropType {
    width: number;
    height: number;
    cornerRadius?: number;
    opacity?: number;
  }

  interface InternalProps {
    widthInternal: number;
    heightInternal: number;
    opacityInternal: number;
    cornerRadius: number;
  }

  const animation = keyframes`
    0% {
      background-position: top right;
    }

    100% {
      background-position: top left;
    }
`;

  const elements = {
    shimmer: styled.div<InternalProps>`
      display: inline-block;
      width: ${({ widthInternal }) => widthInternal}px;
      height: ${({ heightInternal }) => heightInternal}px;
      opacity: ${({ opacityInternal }) => opacityInternal};

      .shimmer {
        border-radius: ${({ cornerRadius }) => cornerRadius}px;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
          -80deg,
          var(--kira_shimmer_bg_from, #333333) 8%,
          var(--kira_shimmer_bg_to, #222223) 18%,
          var(--kira_shimmer_bg_from, #333333) 33%
        );
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: ${({ heightInternal, widthInternal }) => `${widthInternal * 10}px ${heightInternal}px`};
        animation-duration: 2s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: ${animation};
        animation-timing-function: ease-in-out;
        display: flex;
      }
    `,
  };

  export const h: FC<Props> = function Kira_Shimmer({ className, width, height, opacity = 1, cornerRadius = 0 }) {
    return (
      <elements.shimmer
        className={className}
        widthInternal={width}
        heightInternal={height}
        cornerRadius={cornerRadius}
        opacityInternal={opacity}
      >
        <div className='shimmer'></div>
      </elements.shimmer>
    );
  };
}
