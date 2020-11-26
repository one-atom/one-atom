import styled from 'styled-components';
import { OneAtomCommonPropType } from '../prop_type';

/**
 * Text
 */
export namespace Text {
  export type Props = OneAtomCommonPropType;

  interface PropsForCustom extends Props {
    size?: number;
    spacing?: number;
    weight?: number;
  }

  const elements = {
    text: styled.div`
      color: var(--oa-text-color, inherit);
      transition: color 250ms ease;
      display: contents;

      strong {
        color: var(--oa-text-strong, #09f);
        letter-spacing: 0;
      }

      b,
      strong {
        font-weight: 600;
      }

      a {
        word-wrap: break-word;
        color: var(--oa-text-link, #09f);

        &:link,
        &:visited {
          text-decoration: none;
        }
      }
    `,
    p: styled.p`
      font-size: var(--oa-text-p-size, 1rem);
      line-height: var(--oa-text-p-line-height, 2rem);
      font-weight: var(--oa-text-p-weight, 400);
      letter-spacing: var(--oa-text-p-letter-spacing, normal);
    `,
    h1Plus: styled.h1`
      color: var(--oa-text-color-heading, #1b2124);
      font-size: var(--oa-text-h1plus-size, 4rem);
      line-height: var(--oa-text-h1plus-line-height, 4.5rem);
      font-weight: var(--oa-text-h1plus-weight, 700);
      letter-spacing: var(--oa-text-h1plus-weight, -1.5);
    `,
    h1: styled.h1`
      color: var(--oa-text-color-heading, #1b2124);
      font-size: var(--oa-text-h1plus-size, 2.5rem);
      line-height: var(--oa-text-h1plus-line-height, 2.4375rem);
      font-weight: var(--oa-text-h1plus-weight, 700);
      letter-spacing: var(--oa-text-h1plus-weight, -1.5);
    `,
    h2: styled.h2`
      color: var(--oa-text-color-heading, #1b2124);
      font-size: var(--oa-text-h2-size, 2rem);
      line-height: var(--oa-text-h2-line-height, 2.5rem);
      font-weight: var(--oa-text-h2-weight, 700);
      letter-spacing: var(--oa-text-h2-letter-spacing, -0.5);
    `,
    h3: styled.h3`
      color: var(--oa-text-color-heading, #1b2124);
      font-size: var(--oa-text-h3-size, 1.5rem);
      line-height: var(--oa-text-h3-line-height, 2rem);
      font-weight: var(--oa-text-h3-weight, normal);
      letter-spacing: var(--oa-text-h3-letter-spacing, normal);
    `,
    h4: styled.h4`
      color: var(--oa-text-color-heading, #1b2124);
      font-size: var(--oa-text-h4-size, 1rem);
      line-height: var(--oa-text-h4-line-height, 1.5rem);
      font-weight: var(--oa-text-h4-weight, 700);
      letter-spacing: var(--oa-text-h4-letter-spacing, 0.25);
    `,
    custom: styled.span<PropsForCustom>`
      font-size: ${({ size }) => size ?? 1}rem;
      letter-spacing: ${({ spacing }) => spacing ?? 1.7}rem;
      font-weight: ${({ weight }) => weight ?? 500};
      display: inline-flex;
    `,
  };

  export const h: FC<Props> = function OneAtom_Text({ children, className }) {
    return <elements.text className={className}>{children}</elements.text>;
  };

  export const h1_plus: FC<Props> = function OneAtom_Text_h1_plus({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h1Plus>{children}</elements.h1Plus>
      </Text.h>
    );
  };

  export const h1: FC<Props> = function OneAtom_Text_h1({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h1>{children}</elements.h1>
      </Text.h>
    );
  };

  export const h2: FC<Props> = function OneAtom_Text_h2({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h2>{children}</elements.h2>
      </Text.h>
    );
  };

  export const h3: FC<Props> = function OneAtom_Text_h3({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h3>{children}</elements.h3>
      </Text.h>
    );
  };

  export const h4: FC<Props> = function OneAtom_Text_h4({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.h4>{children}</elements.h4>
      </Text.h>
    );
  };

  export const body: FC<Props> = function OneAtom_Text_h4({ children, className }) {
    return (
      <Text.h className={className}>
        <elements.p>{children}</elements.p>
      </Text.h>
    );
  };

  export const custom: FC<PropsForCustom> = function OneAtom_Text_custom({ children, className, ...rest }) {
    return (
      <Text.h className={className}>
        <elements.custom {...rest}>{children}</elements.custom>
      </Text.h>
    );
  };
}
