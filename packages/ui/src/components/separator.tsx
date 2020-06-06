import React from 'react';
import styled from 'styled-components';

/**
 * Separator
 */
export namespace Separator {
  interface Props {
    padding?: number;
    className?: string;
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
      background: #343438;
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
