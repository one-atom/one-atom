import React from 'react';
import { SectionArticle } from '../components/section_article';
import { Article } from '../../';
import { Text } from '../../components/text';
import styled from 'styled-components';
import { Page } from '../components/page';

export namespace Home {
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
              <Text.h1_plus>Almost before we knew it, we had left the ground.</Text.h1_plus>
              <SectionArticle.group>Almost before we knew it, we had left the ground.</SectionArticle.group>
            </SectionArticle.section>
            <SectionArticle.section>
              <Text.h1>Almost before we knew it, we had left the ground.</Text.h1>
              <SectionArticle.group>Almost before we knew it, we had left the ground.</SectionArticle.group>
            </SectionArticle.section>
            <SectionArticle.section>
              <Text.h2>Almost before we knew it, we had left the ground.</Text.h2>
              <SectionArticle.group>Almost before we knew it, we had left the ground.</SectionArticle.group>
            </SectionArticle.section>
            <SectionArticle.section>
              <Text.h3>Almost before we knew it, we had left the ground.</Text.h3>
              <SectionArticle.group>Almost before we knew it, we had left the ground.</SectionArticle.group>
            </SectionArticle.section>
            <SectionArticle.section>
              <Text.h4>Almost before we knew it, we had left the ground.</Text.h4>
              <SectionArticle.group>Almost before we knew it, we had left the ground.</SectionArticle.group>
            </SectionArticle.section>
            <SectionArticle.section>
              <Text.body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
              </Text.body>
              <SectionArticle.group>Almost before we knew it, we had left the ground.</SectionArticle.group>
            </SectionArticle.section>
          </Article.h>
        </Page.h>
      </elements.container>
    );
  };
}
