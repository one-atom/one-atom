import styled from 'styled-components';
import { BaseButton } from '../components_base/base_button.component';
import { OneAtomCommonPropType } from '../prop_type';
import { Size } from './size.component';

/**
 * Button
 */
export namespace Button {
  export interface Props extends BaseButton.Props, Size.Props, OneAtomCommonPropType {
    round?: boolean;
  }

  const elements_shared = {
    button: styled(BaseButton.h)`
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 30px;
      min-width: 30px;
      font-weight: 700;
      padding: 0px 14px;
      box-sizing: border-box;
      transition: background 150ms ease;
      font-size: 0.8125rem; // 13px

      &.round {
        font-size: 16px;
        padding: 0;
      }
    `,
  };

  const elements = {
    actionButton: styled(elements_shared.button)`
      color: var(--oa-button-action-clr, #ffffff);
      background: var(--oa-button-action-bg, #0099ff);

      &:hover:not(:disabled) {
        background: var(--oa-button-action-bg-hover, #0088ff);
      }

      &:active:not(:disabled) {
        background: var(--oa-button-action-bg-active, #0077ff);
      }
    `,
    controlButton: styled(elements_shared.button)`
      color: var(--oa-button-alt-clr, var(--oa-text-color, #ffffff));
      background: var(--oa-button-alt-bg, #333333);

      &:hover:not(:disabled) {
        filter: brightness(90%) hue-rotate(2deg);
      }

      &:active:not(:disabled) {
        filter: brightness(80%) hue-rotate(2deg);
      }
    `,
  };

  export const action: FC<Props> = function OneAtom_Button_action({ children, fluid, className, round, type = 'action', ...rest }) {
    const cls_name = `${className ?? ''} ${round ? 'round' : ''}`;

    return (
      <Size.h fluid={fluid}>
        <elements.actionButton className={cls_name} {...rest}>
          {children}
        </elements.actionButton>
      </Size.h>
    );
  };

  export const alt: FC<Props> = function OneAtom_Button_control({ children, fluid, className, round, type = 'action', ...rest }) {
    const cls_name = `${className ?? ''} ${round ? 'round' : ''}`;

    return (
      <Size.h fluid={fluid}>
        <elements.controlButton className={cls_name} {...rest}>
          {children}
        </elements.controlButton>
      </Size.h>
    );
  };

  export const h: FC<Props> = function OneAtom_Button({ children, fluid, className, type = 'action', ...rest }) {
    return (
      <Size.h fluid={fluid}>
        <elements_shared.button className={className ?? ''} {...rest}>
          {children}
        </elements_shared.button>
      </Size.h>
    );
  };
}