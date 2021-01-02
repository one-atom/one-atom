/// <reference types="../environment" />
import styled from 'styled-components';
import { OneAtomCommonPropType } from '../prop_type';

export interface OneAtomSpacerProps extends OneAtomCommonPropType {
  height?: number;
  width?: number;
}

const elements = {
  body: styled.span<{ width?: number; height?: number }>`
    width: ${({ width }) => width ?? null}px;
    height: ${({ height }) => height ?? null}px;
  `,
};

export const Spacer: FC<OneAtomSpacerProps> = function OneAtom_Spacer({ height, width, className }) {
  return <elements.body className={className} height={height} width={width}></elements.body>;
};
