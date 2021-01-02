/* eslint-disable @typescript-eslint/no-empty-interface*/
/// <reference types="../environment" />
import styled from 'styled-components';
import { OneAtomSizeProps, Size } from './size.component';
import { OneAtomCommonPropType } from '../prop_type';

export interface OneAtomStaticButtonProps extends OneAtomSizeProps, OneAtomCommonPropType {}

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

export const StaticButton: FC<OneAtomStaticButtonProps> = function OneAtom_Button({ children, fluid, className, ...rest }) {
  return (
    <Size fluid={fluid} className={className}>
      <elements.button {...rest}>{children}</elements.button>
    </Size>
  );
};
