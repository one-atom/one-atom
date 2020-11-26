import React, { FC } from 'react';
import styled from 'styled-components';
import { OneAtomCommonPropType } from '../prop_type';

/**
 * Spacer
 */
export namespace Spacer {
  export interface Props extends OneAtomCommonPropType {
    height?: number;
    width?: number;
  }

  const elements = {
    body: styled.span<{ width?: number; height?: number }>`
      width: ${({ width }) => width ?? null}px;
      height: ${({ height }) => height ?? null}px;
    `,
  };

  export const h: FC<Props> = function OneAtom_Spacer({ height, width }) {
    return <elements.body height={height} width={width}></elements.body>;
  };
}
