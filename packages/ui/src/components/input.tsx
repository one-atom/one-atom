import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { BaseInput } from '@kira/ui-std';
import { Size } from './size';

/**
 * Input
 */
export namespace Input {
  interface Props extends BaseInput.Props, Size.Props {}

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
      color: #ffffff;
      background-color: rgb(51, 51, 51);
      width: 100%;
    `,
  };

  export const h: React.FC<Props> = forwardRef(function __kira__input({ fluid, className, ...rest }, ref) {
    return (
      <Size.h fluid={fluid} className={className}>
        <elements.label>
          <elements.input {...rest} ref={ref} />
        </elements.label>
      </Size.h>
    );
  });
}
