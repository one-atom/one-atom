import React from 'react';
import { Header } from '../components/header';
import { SectionContent } from '../components/section_content';
import { SectionArticle } from '../components/section_article';
import { Article } from '../../';
import { Text } from '../../components/text';
import styled from 'styled-components';

export namespace Home {
  const elements = {
    container: styled.div`
      display: contents;
    `,
  };

  export const h: React.FC = function Home() {
    return (
      <elements.container>
        <Header.h></Header.h>
        <SectionContent.h>
          <Article.h>
            <SectionArticle.section>Almost before we knew it, we had left the ground.</SectionArticle.section>
            <SectionArticle.section>Almost before we knew it, we had left the ground.</SectionArticle.section>
            <SectionArticle.section>
              <Text.h1_plus>Almost before we knew it, we had left the ground.</Text.h1_plus>
              <SectionArticle.group>Almost before we knew it, we had left the ground.</SectionArticle.group>
            </SectionArticle.section>
            <SectionArticle.section>Almost before we knew it, we had left the ground.</SectionArticle.section>
          </Article.h>
        </SectionContent.h>
      </elements.container>
    );
  };
}
