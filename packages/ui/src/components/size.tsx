import React from 'react';
import styled from 'styled-components';

/**
 * Size
 */
export namespace Size {
  export interface Props {
    fluid?: boolean;
    className?: string;
  }

  const elements = {
    fluid: styled.span`
      position: relative;
      display: inline-block;
      width: 100%;

      & > * {
        width: 100%;
      }
    `,
  };

  export const h: React.FC<Props> = function __kira__size({ children, className, fluid = false }) {
    if (fluid) {
      return <elements.fluid className={className}>{children}</elements.fluid>;
    }

    return <span className={className}>{children}</span>;
  };
}
