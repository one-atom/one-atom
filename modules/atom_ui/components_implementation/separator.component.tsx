/// <reference types="../environment" />
import styled from 'styled-components';
import { OneAtomCommonPropType } from '../prop_type';

export interface OneAtomSeparatorProps extends OneAtomCommonPropType {
  padding?: number;
}

const elements = {
  separator: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
  `,
  inner: styled.div<{ padding: number }>`
    height: 1px;
    width: calc(100% - ${({ padding }) => padding}px);
    background: var(--oa-separator-bg, #343438);
  `,
};

export const Separator: FC<OneAtomSeparatorProps> = function OneAtom_Separator({ children, className, padding }) {
  return (
    <elements.separator aria-hidden="true" className={className}>
      <elements.inner padding={padding ?? 0}>{children}</elements.inner>
    </elements.separator>
  );
};
