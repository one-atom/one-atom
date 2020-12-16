/// <reference types="../environment" />
import styled from 'styled-components';
import { OneAtomCommonPropType } from '../prop_type';

/**
 * Size
 */
export namespace Size {
  export interface Props extends OneAtomCommonPropType {
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

  export const h: FC<Props> = function OneAtom_Size({ children, className, fluid = false }) {
    if (fluid) {
      return <elements.fluid className={className}>{children}</elements.fluid>;
    }

    return <span className={className}>{children}</span>;
  };
}
