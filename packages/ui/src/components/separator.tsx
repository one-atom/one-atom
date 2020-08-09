import React from 'react';
import styled from 'styled-components';
import { KiraPropType } from '@kira/ui-std';

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

  export const h: React.FC<Props> = function __kira__separator({ children, className, padding }) {
    return (
      <elements.separator aria-hidden='true' className={className}>
        <elements.inner padding={padding ?? 0}>{children}</elements.inner>
      </elements.separator>
    );
  };
}
