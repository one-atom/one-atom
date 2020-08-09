import React from 'react';
import styled from 'styled-components';
import { KiraPropType } from '@kira/ui-std';

/**
 * Text
 */
export namespace Text {
  export interface Props extends KiraPropType {}

  interface PropsForCustom extends Props {
    size?: number;
    spacing?: number;
    weight?: number;
  }

  const elements = {
    text: styled.div`
      color: inherit;
      transition: color 250ms ease;

      strong {
        color: #000;
        letter-spacing: 0;
      }

      b,
      strong {
        font-weight: 600;
      }

      a {
        word-wrap: break-word;
        color: var(--kira-link, #09f);

        &:link,
        &:visited {
          text-decoration: none;
        }
      }
    `,
    p: styled.p`
      font-size: 1.125rem;
      line-height: 1.7;
      font-weight: 400;
    `,
    h1: styled.h1`
      font-size: 6rem;
      font-weight: 200;
      letter-spacing: -1.5;
    `,
    h2: styled.h2`
      font-size: 3.75rem;
      font-weight: 200;
      letter-spacing: -0.5;
    `,
    h3: styled.h3`
      font-size: 3rem;
    `,
    h4: styled.h4`
      font-size: 2.266rem;
      letter-spacing: 0.25;
    `,
    h5: styled.h5`
      font-size: 2rem;
    `,
    h6: styled.h6`
      font-size: 1.25rem;
      letter-spacing: 0.15;
    `,
    custom: styled.span<PropsForCustom>`
      font-size: ${({ size }) => size ?? 1}rem;
      letter-spacing: ${({ spacing }) => spacing ?? 1.7}rem;
      font-weight: ${({ weight }) => weight ?? 500};
      display: inline-flex;
    `,
  };

  export const h: React.FC<Props> = function __kira__text({ children, className }) {
    return <elements.text className={className}>{children}</elements.text>;
  };

  export const title: React.FC<Props> = function title({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h1>{children}</elements.h1>
      </Text.h>
    );
  };

  export const title2: React.FC<Props> = function title2({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h2>{children}</elements.h2>
      </Text.h>
    );
  };

  export const title3: React.FC<Props> = function title3({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h3>{children}</elements.h3>
      </Text.h>
    );
  };

  export const title4: React.FC<Props> = function title4({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h4>{children}</elements.h4>
      </Text.h>
    );
  };

  export const title5: React.FC<Props> = function title5({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h5>{children}</elements.h5>
      </Text.h>
    );
  };

  export const title6: React.FC<Props> = function title6({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h6>{children}</elements.h6>
      </Text.h>
    );
  };

  export const headline: React.FC<Props> = function headline({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h5>{children}</elements.h5>
      </Text.h>
    );
  };

  export const body: React.FC<Props> = function p({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.p>{children}</elements.p>
      </Text.h>
    );
  };

  export const callout: React.FC<Props> = function p({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.p>{children}</elements.p>
      </Text.h>
    );
  };

  export const caption: React.FC<Props> = function p({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.p>{children}</elements.p>
      </Text.h>
    );
  };

  export const footnote: React.FC<Props> = function p({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.p>{children}</elements.p>
      </Text.h>
    );
  };

  export const custom: React.FC<PropsForCustom> = function custom({ children, className, ...rest }) {
    return (
      <Text.h className={className}>
        <elements.custom {...rest}>{children}</elements.custom>
      </Text.h>
    );
  };
}
