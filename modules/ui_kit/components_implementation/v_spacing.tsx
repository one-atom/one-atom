import React, { FC } from 'react';
import styled from 'styled-components';
import { KiraPropType } from '../prop_type';

/**
 * change this
 */
export namespace VSpacing {
  export interface Props extends KiraPropType {
    px: number;
  }

  const elements = {
    spacing: styled.span<{ px: number }>`
      height: ${({ px }) => px}px;
      display: inline-block;
    `,
  };

  export const h: FC<Props> = function Kira_Vertical_spacing({ px }) {
    return <elements.spacing px={px} aria-hidden="true" />;
  };
}
