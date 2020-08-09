import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { focusContext } from '../helpers/focus_context';
import { KiraPropType } from '../prop_type';

/**
 * BaseButton
 */
export namespace BaseButton {
  export interface Props extends KiraPropType {
    tabIndex?: number;
    disabled?: boolean;
    type?: 'submit' | 'reset' | 'button';
    onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseMove?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseDown?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseUp?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onKeyUp?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
    onTouchEnd?: (event: React.TouchEvent<HTMLButtonElement>) => void;
    onTouchMove?: (event: React.TouchEvent<HTMLButtonElement>) => void;
    onTouchStart?: (event: React.TouchEvent<HTMLButtonElement>) => void;
  }

  // The base_button component does not include "cursor: pointer;" due to
  // official standards specifying that: "The cursor is a pointer that indicates
  // a link." https://www.w3.org/TR/CSS21/ui.html#propdef-cursor
  //
  // Microsoft and Apple also specifies that the "correct" interaction is to
  // reserve the pointing hand to URL links
  // https://docs.microsoft.com/en-gb/windows/win32/uxguide/inter-mouse?redirectedfrom=MSDN
  // https://developer.apple.com/design/human-interface-guidelines/macos/user-interaction/mouse-and-trackpad/
  //
  // If you'd want to have buttons with cursors, that's fine, but you'll need to
  // extend the base_button component in order to get that interaction
  const elements = {
    base_button: styled.button`
      border: none;
      margin: 0;
      padding: 0;
      width: auto;
      overflow: visible;
      background: transparent;
      color: inherit;
      font: inherit;
      line-height: normal;
      -webkit-font-smoothing: inherit;
      -moz-osx-font-smoothing: inherit;
      -webkit-appearance: none;
    `,
  };

  export const h: React.FC<Props> = function __kira__base_button({ ...props }) {
    // Takes out these values to be used as variables here.
    const {
      children,
      className,
      disabled,
      // Takes out focus events for override.
      onBlur,
      onFocus,
      // Takes out mouse events for override.
      onClick,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
      // Takes out keyboard events for override.
      onKeyUp,
      onKeyDown,
      // Takes out touch events for override.
      onTouchEnd,
      onTouchMove,
      onTouchStart,
      onMouseMove,
      // defaults.
      tabIndex = 0,
      type = 'button',
      // Spreads anything else.
      ...rest
    } = props;

    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isFocused, setIsFocus] = useState(false);

    if (disabled && isFocused) setIsFocus(false);

    const downRef = useRef(false);

    // Focus events
    function handle_blur(event: React.FocusEvent<HTMLButtonElement>) {
      setIsFocus(false);

      focusContext.current = null;

      if (onBlur) onBlur(event);
    }

    function handle_focus(event: React.FocusEvent<HTMLButtonElement>) {
      setIsFocus(true);

      focusContext.current = buttonRef.current;

      if (onFocus) onFocus(event);
    }

    // Mouse events
    function handle_click(event: React.MouseEvent<HTMLButtonElement>) {
      if (onClick) onClick(event);
    }

    function handle_mouse_down(event: React.MouseEvent<HTMLButtonElement>) {
      if (!downRef) {
      }

      if (onMouseDown) onMouseDown(event);
    }
    function handle_mouse_up(event: React.MouseEvent<HTMLButtonElement>) {
      if (onMouseUp) onMouseUp(event);
    }

    function handle_mouse_enter(event: React.MouseEvent<HTMLButtonElement>) {
      if (onMouseEnter) onMouseEnter(event);
    }

    function handle_mouse_leave(event: React.MouseEvent<HTMLButtonElement>) {
      if (onMouseLeave) onMouseLeave(event);
    }

    function handle_mouse_move(event: React.MouseEvent<HTMLButtonElement>) {
      if (onMouseMove) onMouseMove(event);
    }

    // Keyboard events
    function handle_key_down(event: React.KeyboardEvent<HTMLButtonElement>) {
      if (isFocused && event.key === 'Escape' && focusContext.current) {
        focusContext.current.blur();
      }
    }

    function handle_key_up(event: React.KeyboardEvent<HTMLButtonElement>) {
      if (onKeyUp) onKeyUp(event);
    }

    // Touch events
    function handle_touch_start(event: React.TouchEvent<HTMLButtonElement>) {
      if (onTouchStart) onTouchStart(event);
    }

    function handle_touch_end(event: React.TouchEvent<HTMLButtonElement>) {
      if (onTouchEnd) onTouchEnd(event);
    }

    function handle_touch_move(event: React.TouchEvent<HTMLButtonElement>) {
      if (onTouchMove) onTouchMove(event);
    }

    return (
      <elements.base_button
        aria-pressed={false}
        ref={buttonRef}
        className={className}
        disabled={disabled}
        tabIndex={disabled ? -1 : tabIndex}
        onBlur={handle_blur}
        onClick={handle_click}
        onFocus={handle_focus}
        onKeyDown={handle_key_down}
        onKeyUp={handle_key_up}
        onMouseDown={handle_mouse_down}
        onMouseMove={handle_mouse_move}
        onMouseEnter={handle_mouse_enter}
        onMouseLeave={handle_mouse_leave}
        onMouseUp={handle_mouse_up}
        onTouchEnd={handle_touch_end}
        onTouchMove={handle_touch_move}
        onTouchStart={handle_touch_start}
        type={type}
        {...rest}
      >
        {children}
      </elements.base_button>
    );
  };
}
