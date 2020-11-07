/* eslint-disable @typescript-eslint/no-empty-interface*/

import React, { FC, forwardRef } from 'react';
import styled from 'styled-components';
import { BaseInput, KiraPropType } from '../../../ui-std/src/index';
import { Size } from './size';

/**
 * Input
 */
export namespace Input {
  export interface Props extends BaseInput.Props, Size.Props, KiraPropType {}

  const elements = {
    label: styled.label`
      min-width: 40px;
      display: block;
      position: relative;
      box-sizing: border-box;
    `,
    input: styled(BaseInput.h)`
      height: 40px;
      padding: 0px 16px;
      box-sizing: border-box;
      border-radius: 10px;
      color: var(--kira_input_clr, rgb(51, 51, 51));
      background-color: var(--kira_input_bg, rgb(51, 51, 51));
      width: 100%;

      &:focus {
        outline-width: 0px;
        box-shadow: inset 0 0 0 1px var(--kira_input_focus_clr, #0099ff);
      }
    `,
  };

  export const h: FC<Props> = forwardRef(function Kira__Input({ fluid, className, ...rest }, ref) {
    return (
      <Size.h fluid={fluid} className={className}>
        <elements.label>
          <elements.input {...rest} ref={ref} />
        </elements.label>
      </Size.h>
    );
  });
}
