import React, { useState, InputHTMLAttributes, forwardRef, FC } from 'react';
import styled from 'styled-components';
import { KiraPropType } from '../prop_type';

/**
 * BaseInput
 */
export namespace BaseInput {
  export interface Props extends InputHTMLAttributes<HTMLInputElement>, KiraPropType {
    ref?: any;
    type:
      | 'button'
      | 'checkbox'
      | 'color'
      | 'date'
      | 'datetime-local'
      | 'email'
      | 'file'
      | 'hidden'
      | 'image'
      | 'month'
      | 'number'
      | 'password'
      | 'radio'
      | 'range'
      | 'reset'
      | 'search'
      | 'submit'
      | 'tel'
      | 'text'
      | 'time'
      | 'url'
      | 'week';
  }

  const elements = {
    baseInput: styled.input`
      display: block;
      font: inherit;
      color: currentColor;
      border: 0;
      margin: 0;
      padding: 6px 0 7px;
      display: block;
      min-width: 0;
      box-sizing: content-box;
      background: none;
      -webkit-tap-highlight-color: transparent;
      outline: none;
      font-size: 1rem;
    `,
  };

  export const h: FC<Props> = forwardRef(function Kira_BaseInput(props, ref) {
    const {
      // Takes out these values to be used as variables here.
      children,
      className,
      disabled,
      type,
      // defaults.
      tabIndex = 0,
      // Spreads anything else.
      ...rest
    } = props;

    const [isFocused, setIsFocus] = useState(false);

    if (disabled && isFocused) setIsFocus(false);

    return (
      <elements.baseInput
        ref={ref}
        aria-invalid={true}
        aria-describedby={''}
        className={className}
        disabled={disabled}
        tabIndex={disabled ? -1 : tabIndex}
        type={type}
        {...rest}
      />
    );
  });
}