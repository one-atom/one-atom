import React from 'react';
import { SectionArticle } from '../components/section_article';
import { Article } from '../../';
import styled from 'styled-components';
import { Page } from '../components/page';
import { Button } from '../../components/button';

export namespace Buttons {
  const elements = {
    container: styled.div`
      display: contents;
    `,
  };

  export const h: React.FC = function Home() {
    return (
      <elements.container>
        <Page.h headerTitle='Almost before we knew it, we had left the ground.'>
          <Article.h>
            <SectionArticle.section>
              <Button.action>Qwee</Button.action>
              <Button.alt>Qwee</Button.alt>
            </SectionArticle.section>
          </Article.h>
        </Page.h>
      </elements.container>
    );
  };
}
