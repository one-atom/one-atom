import React, { FC } from 'react';
import styled from 'styled-components';
import { KiraPropType } from '../../../ui-std/src/index';

/**
 * Separator
 */
export namespace Separator {
  export interface Props extends KiraPropType {
    padding?: number;
  }

  const elements = {
    separator: styled.div`
      width: 100%;
      display: flex;
      justify-content: center;
    `,
    inner: styled.div<{ padding: number }>`
      height: 2px;
      width: calc(100% - ${({ padding }) => padding}px);
      background: var(--kira_separator_bg, #343438);
    `,
  };

  export const h: FC<Props> = function Kira_Separator({ children, className, padding }) {
    return (
      <elements.separator aria-hidden='true' className={className}>
        <elements.inner padding={padding ?? 0}>{children}</elements.inner>
      </elements.separator>
    );
  };
}
