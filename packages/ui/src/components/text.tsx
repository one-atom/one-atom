import React from 'react';
import styled from 'styled-components';
import { KiraPropType } from '@kira/ui-std';

/**
 * Text
 */
export namespace Text {
  export type Props = KiraPropType;

  interface PropsForCustom extends Props {
    size?: number;
    spacing?: number;
    weight?: number;
  }

  const elements = {
    text: styled.div`
      color: var(--kira-text-color, inherit);
      transition: color 250ms ease;
      display: contents;

      strong {
        color: var(--kira-text-strong, #09f);
        letter-spacing: 0;
      }

      b,
      strong {
        font-weight: 600;
      }

      a {
        word-wrap: break-word;
        color: var(--kira-text-link, #09f);

        &:link,
        &:visited {
          text-decoration: none;
        }
      }
    `,
    p: styled.p`
      font-size: var(--kira-text-p-size, 1.125rem);
      line-height: var(--kira-text-p-line-height, 1.7rem);
      font-weight: var(--kira-text-p-weight, 400);
      letter-spacing: var(--kira-text-p-letter-spacing, normal);
    `,
    h1Plus: styled.h1`
      color: var(--kira-text-color-heading, #1b2124);
      font-size: var(--kira-text-h1plus-size, 4rem);
      line-height: var(--kira-text-h1plus-line-height, 4.5rem);
      font-weight: var(--kira-text-h1plus-weight, 700);
      letter-spacing: var(--kira-text-h1plus-weight, -1.5);
    `,
    h2: styled.h2`
      font-size: var(--kira-text-h2-size, 3.75rem);
      line-height: var(--kira-text-h2-line-height, 200);
      font-weight: var(--kira-text-h2-weight, normal);
      letter-spacing: var(--kira-text-h2-letter-spacing, -0.5);
    `,
    h3: styled.h3`
      font-size: var(--kira-text-h3-size, 3rem);
      line-height: var(--kira-text-h3-line-height, normal);
      font-weight: var(--kira-text-h3-weight, normal);
      letter-spacing: var(--kira-text-h3-letter-spacing, normal);
    `,
    h4: styled.h4`
      font-size: var(--kira-text-h4-size, 2.266rem);
      line-height: var(--kira-text-h4-line-height, normal);
      font-weight: var(--kira-text-h4-weight, normal);
      letter-spacing: var(--kira-text-h4-letter-spacing, 0.25);
    `,
    h5: styled.h5`
      font-size: var(--kira-text-h5-size, 2rem);
      line-height: var(--kira-text-h5-line-height, normal);
      font-weight: var(--kira-text-h5-weight, normal);
      letter-spacing: var(--kira-text-h5-letter-spacing, normal);
    `,
    h6: styled.h6`
      font-size: var(--kira-text-h6-size, 1.25rem);
      line-height: var(--kira-text-h6-line-height, normal);
      font-weight: var(--kira-text-h6-weight, normal);
      letter-spacing: var(--kira-text-h6-letter-spacing, 0.15);
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

  export const h1_plus: React.FC<Props> = function __kira__text_title({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h1Plus>{children}</elements.h1Plus>
      </Text.h>
    );
  };

  export const title2: React.FC<Props> = function __kira__text_title2({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h2>{children}</elements.h2>
      </Text.h>
    );
  };

  export const title3: React.FC<Props> = function __kira__text_title3({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h3>{children}</elements.h3>
      </Text.h>
    );
  };

  export const title4: React.FC<Props> = function __kira__text_title4({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h4>{children}</elements.h4>
      </Text.h>
    );
  };

  export const title5: React.FC<Props> = function __kira__text_title5({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h5>{children}</elements.h5>
      </Text.h>
    );
  };

  export const title6: React.FC<Props> = function __kira__text_title6({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h6>{children}</elements.h6>
      </Text.h>
    );
  };

  export const headline: React.FC<Props> = function __kira__text_headline({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h5>{children}</elements.h5>
      </Text.h>
    );
  };

  export const body: React.FC<Props> = function __kira__text_body({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.p>{children}</elements.p>
      </Text.h>
    );
  };

  export const callout: React.FC<Props> = function __kira__text_callout({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.p>{children}</elements.p>
      </Text.h>
    );
  };

  export const caption: React.FC<Props> = function __kira__text_caption({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.p>{children}</elements.p>
      </Text.h>
    );
  };

  export const footnote: React.FC<Props> = function __kira__text_footnote({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.p>{children}</elements.p>
      </Text.h>
    );
  };

  export const custom: React.FC<PropsForCustom> = function __kira__text_custom({ children, className, ...rest }) {
    return (
      <Text.h className={className}>
        <elements.custom {...rest}>{children}</elements.custom>
      </Text.h>
    );
  };
}
