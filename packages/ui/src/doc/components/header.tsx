import React from 'react';
import styled from 'styled-components';
import { OuterContent } from './outer_content';
import { Text } from '../../components/text';

export namespace Header {
  const elements = {
    container: styled.div`
      background: #443df6;
      height: 384px;
      --kira-text-color-heading: #fff;
    `,
    innerContainer: styled.div`
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      padding: 80px 0;
    `,
  };
  export const h: React.FC = function Header() {
    return (
      <elements.container>
        <OuterContent.h>
          <elements.innerContainer>
            <div></div>
            <Text.h1_plus>Almost before we knew it, we had left the ground.</Text.h1_plus>
          </elements.innerContainer>
        </OuterContent.h>
      </elements.container>
    );
  };
}
