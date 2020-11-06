import React from 'react';
import styled from 'styled-components';

export namespace SectionArticle {
  const elements = {
    section: styled.div`
      margin-bottom: 56px;
    `,
    splitSection: styled.main`
      display: flex;
      margin-bottom: 56px;
    `,
    group: styled.div``,
  };

  export const section: React.FC = function SectionArticle_section({ children }) {
    return <elements.section>{children}</elements.section>;
  };

  export const split_section: React.FC = function SectionArticle_split_section({ children }) {
    return <elements.splitSection>{children}</elements.splitSection>;
  };

  export const group: React.FC = function SectionArticle_group({ children }) {
    return <elements.group>{children}</elements.group>;
  };
}
