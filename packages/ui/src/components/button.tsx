import React from 'react';
import styled from 'styled-components';
import { BaseButton } from '@kira/ui-std';
import { Size } from './size';

/**
 * Button
 */
export namespace Button {
  interface Props extends BaseButton.Props, Size.Props {}

  const elements = {
    button: styled(BaseButton.h)`
      height: 40px;
      padding: 0px 16px;
      border-radius: 20px;
      box-sizing: border-box;
      color: #ffffff;
      background-color: #0099ff;
    `,
  };

  export const h: React.FC<Props> = function __kira__button({ children, fluid, className, ...rest }) {
    return (
      <Size.h fluid={fluid} className={className ?? ''}>
        <elements.button {...rest}>{children}</elements.button>
      </Size.h>
    );
  };
}
