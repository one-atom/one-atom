/// <reference types="../environment" />
import styled from 'styled-components';
import { OneAtomCommonPropType } from '../prop_type';

export interface OneAtomHSpacingProps extends OneAtomCommonPropType {
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

export const HSpacing: FC<OneAtomHSpacingProps> = function OneAtom_horizontal_spacing({ px, className }) {
  return <elements.spacing className={className} px={px} aria-hidden="true" />;
};
