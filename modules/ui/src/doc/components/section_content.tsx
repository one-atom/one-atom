import React, { Fragment } from 'react';
import styled from 'styled-components';
import { OuterContent } from './outer_content';
import { HSpacing } from '../../components/h_spacing';
import { VSpacing } from '../../components/v_spacing';

export namespace SectionContent {
  const elements = {
    nav: styled.div`
      width: 200px;
    `,
    main: styled.main`
      display: flex;
      flex-direction: column;
      flex: 1;
    `,
  };

  export const h: React.FC = function SectionContent({ children }) {
    return (
      <Fragment>
        <VSpacing.h px={96} />
        <OuterContent.h>
          <elements.nav>Almost before we knew it, we had left the ground.</elements.nav>
          <HSpacing.h px={15} />
          <elements.main>{children}</elements.main>
        </OuterContent.h>
      </Fragment>
    );
  };
}
