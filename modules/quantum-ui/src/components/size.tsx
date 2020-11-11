import React, { FC } from 'react';
import styled from 'styled-components';
import { KiraPropType } from '../../../ui-std/src/index';

/**
 * Size
 */
export namespace Size {
  export interface Props extends KiraPropType {
    fluid?: boolean;
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

  export const h: FC<Props> = function Kira_Size({ children, className, fluid = false }) {
    if (fluid) {
      return <elements.fluid className={className}>{children}</elements.fluid>;
    }

    return <span className={className}>{children}</span>;
  };
}
