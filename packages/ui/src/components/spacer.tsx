import React from 'react';
import styled from 'styled-components';

/**
 * Spacer
 */
export namespace Spacer {
  export interface Props {
    height?: number;
    width?: number;
  }

  const elements = {
    body: styled.span<{ width?: number; height?: number }>`
      width: ${({ width }) => width ?? null}px;
      height: ${({ height }) => height ?? null}px;
    `,
  };

  export const h: React.FC<Props> = function __kira__size({ height, width }) {
    return <elements.body height={height} width={width}></elements.body>;
  };
}
