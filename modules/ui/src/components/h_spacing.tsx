import React, { FC } from 'react';
import styled from 'styled-components';
import { KiraPropType } from '@kira/ui-std';

/**
 * change this
 */
export namespace HSpacing {
  export interface Props extends KiraPropType {
    px: number;
  }

  const elements = {
    spacing: styled.span<{ px: number }>`
      width: ${({ px }) => px}px;
      display: inline-block;
    `,
  };

  export const h: FC<Props> = function Kira_horizontal_spacing({ px }) {
    return <elements.spacing px={px} aria-hidden='true' />;
  };
}
