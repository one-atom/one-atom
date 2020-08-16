import React from 'react';
import styled from 'styled-components';

export namespace OuterContent {
  const elements = {
    container: styled.div`
      display: flex;
      max-width: 1135px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      padding: 0 16px;
      box-sizing: content-box;
    `,
  };
  export const h: React.FC = function OuterContent({ children }) {
    return <elements.container>{children}</elements.container>;
  };
}
