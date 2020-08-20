import React from 'react';
import styled from 'styled-components';
import { BaseButton, KiraPropType } from '@kira/ui-std';
import { Size } from './size';

/**
 * Button
 */
export namespace Button {
  export interface Props extends BaseButton.Props, Size.Props, KiraPropType {}

  const elements_shared = {
    button: styled(BaseButton.h)`
      position: relative;
      height: 40px;
      padding: 0px 16px;
      box-sizing: border-box;
      transition: background 150ms ease;
    `,
  };

  const elements = {
    actionButton: styled(elements_shared.button)`
      border-radius: 20px;
      color: var(--kira-button-action-clr, #ffffff);
      background: var(--kira-button-action-bg, linear-gradient(180deg, #0099ff, #008be8));

      &:hover {
        box-shadow: 0px 0.5px 1.5px rgba(54, 122, 246, 0.25);
      }
    `,
    controlButton: styled(elements_shared.button)`
      color: var(--kira-button-control-clr, var(--kira-text-color, #111));
      border-radius: 5px;

      &:hover {
        background: var(--kira-button-control-bg, #e5e5e5);
      }
    `,
  };

  export const action: React.FC<Props> = function __kira__button_action({ children, fluid, className, type = 'action', ...rest }) {
    return (
      <Size.h fluid={fluid} className={className ?? ''}>
        <elements.actionButton {...rest}>{children}</elements.actionButton>
      </Size.h>
    );
  };

  export const alt: React.FC<Props> = function __kira__button_control({ children, fluid, className, type = 'action', ...rest }) {
    return (
      <Size.h fluid={fluid} className={className ?? ''}>
        <elements.controlButton {...rest}>{children}</elements.controlButton>
      </Size.h>
    );
  };
  export const h: React.FC<Props> = function __kira__button({ children, fluid, className, type = 'action', ...rest }) {
    return (
      <Size.h fluid={fluid} className={className ?? ''}>
        <elements_shared.button {...rest}>{children}</elements_shared.button>
      </Size.h>
    );
  };
}
