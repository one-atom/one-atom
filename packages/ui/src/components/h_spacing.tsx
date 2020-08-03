import React from 'react';
import styled from 'styled-components';

/**
 * change this
 */
export namespace HSpacing {
  export interface Props {
    px: number;
  }

  const elements = {
    spacing: styled.span<{ px: number }>`
      width: ${({ px }) => px}px;
      display: inline-block;
    `,
  };

  export const h: React.FC<Props> = function __kira__h_spacing({ px }) {
    return <elements.spacing px={px} aria-hidden='true' />;
  };
}
