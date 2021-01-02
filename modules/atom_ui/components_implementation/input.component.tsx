/* eslint-disable @typescript-eslint/no-empty-interface*/
/// <reference types="../environment" />
import { forwardRef } from 'react';
import styled from 'styled-components';
import { OneAtomCommonPropType } from '../prop_type';
import { BaseInput, OneAtomBaseInputProps } from '../components_base/base_input.component';
import { Size, OneAtomSizeProps } from './size.component';

export interface OneAtomInputProps extends OneAtomBaseInputProps, OneAtomSizeProps, OneAtomCommonPropType {}

const elements = {
  label: styled.label`
    min-width: 40px;
    display: block;
    position: relative;
    box-sizing: border-box;
  `,
  input: styled(BaseInput)`
    height: 40px;
    padding: 0px 16px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: var(--oa-input-bg, rgb(51, 51, 51));
    width: 100%;
    font-size: 0.8125rem; // 13px
    line-height: 1.05875; // 16.94px
    transition: background-color 0.3s ease;

    &:focus:not(:disabled) {
      outline-width: 0px;
      box-shadow: inset 0 0 0 1px var(--oa-input-focus-clr, #0099ff);
    }
  `,
};

export const Input: FC<OneAtomInputProps> = forwardRef(function OneAtom__Input({ fluid, className, ...rest }, ref) {
  return (
    <Size fluid={fluid} className={className}>
      <elements.label>
        <elements.input {...rest} ref={ref} />
      </elements.label>
    </Size>
  );
});
