/* eslint-disable @typescript-eslint/no-empty-interface*/

import React from 'react';
import styled from 'styled-components';
import { Size } from './size';
import { KiraPropType } from '@kira/ui-std';

/**
 * StaticButton
 */
export namespace StaticButton {
  export interface Props extends Size.Props, KiraPropType {}

  const elements = {
    button: styled.div`
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
      <Size.h fluid={fluid} className={className}>
        <elements.button {...rest}>{children}</elements.button>
      </Size.h>
    );
  };
}
