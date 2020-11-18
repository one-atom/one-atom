import React, { FC } from 'react';
import styled from 'styled-components';
import { KiraPropType } from '../prop_type';

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
      flex-shrink: 0;
      height: 100%;
    `,
  };

  export const h: FC<Props> = function Kira_horizontal_spacing({ px }) {
    return <elements.spacing px={px} aria-hidden="true" />;
  };
}
