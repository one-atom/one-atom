/// <reference types="../environment" />
import styled from 'styled-components';
import { OneAtomCommonPropType } from '../prop_type';

/**
 * change this
 */
export namespace HSpacing {
  export interface Props extends OneAtomCommonPropType {
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

  export const h: FC<Props> = function OneAtom_horizontal_spacing({ px, className }) {
    return <elements.spacing className={className} px={px} aria-hidden="true" />;
  };
}
