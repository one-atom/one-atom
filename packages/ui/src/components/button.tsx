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
      height: 30px;
      font-weight: 600;
      padding: 0px 12px;
      box-sizing: border-box;
      transition: background 150ms ease;
      font-size: 0.8125rem;
    `,
  };

  const elements = {
    actionButton: styled(elements_shared.button)`
      border-radius: 15px;
      color: var(--kira-button-action-clr, #ffffff);
      background: var(--kira-button-action-bg, #0099ff);

      &:hover:not(:disabled) {
        background: var(--kira-button-action-bg-hover, #0088ff);
      }

      &:active:not(:disabled) {
        background: var(--kira-button-action-bg-active, #0077ff);
      }
    `,
    controlButton: styled(elements_shared.button)`
      color: var(--kira-button-control-clr, var(--kira-text-color, #f3f3f3));
      border-radius: 5px;

      &:hover:not(:disabled) {
        background: var(--kira-button-control-bg, #eeeeee);
      }

      &:active:not(:disabled) {
        background: var(--kira-button-action-bg-active, #dddddd);
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
