import React from 'react';
import styled from 'styled-components';

/**
 * Article
 */
export namespace Article {
  interface Props {
    center?: boolean;
    className?: string;
  }

  const elements = {
    article: styled.div<{ center?: boolean }>`
      display: contents;

      ${({ center }) => center && `text-align: center;`}

      p {
        margin-bottom: 10px;
      }

      h1 {
        margin-bottom: 30px;
      }

      h2 {
        margin-bottom: 30px;
      }

      h3 {
        margin-bottom: 30px;
      }

      h4 {
        margin-bottom: 30px;
      }

      h5 {
        margin-bottom: 15px;
      }

      h6 {
        margin-bottom: 5px;
      }
    `,
  };

  export const h: React.FC<Props> = function __kira__article({ children, className, center, ...rest }) {
    return (
      <elements.article center={center} className={className} {...rest}>
        {children}
      </elements.article>
    );
  };
}
