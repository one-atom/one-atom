import React from 'react';
import styled from 'styled-components';
import { Header } from './header';
import { SectionContent } from './section_content';

export namespace Page {
  interface Props {
    headerTitle: string;
  }

  const elements = {
    container: styled.div`
      display: contents;
    `,
  };

  export const h: React.FC<Props> = function Page({ children, headerTitle }) {
    return (
      <elements.container>
        <Header.h>{headerTitle}</Header.h>
        <SectionContent.h>{children}</SectionContent.h>
      </elements.container>
    );
  };
}
