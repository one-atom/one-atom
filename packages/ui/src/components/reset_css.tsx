import { createGlobalStyle } from 'styled-components';

export namespace ResetCss {
  export const h = createGlobalStyle`
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, menu, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    main, menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }


    article, aside, details, figcaption, figure,
    footer, header, hgroup, main, menu, nav, section {
      display: block;
    }

    menu, ol, ul {
      list-style: none;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    body {
      line-height: 1;
    }

    html {
      box-sizing: border-box;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        Helvetica,
        Arial,
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol';
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      text-rendering: auto;
      letter-spacing: normal;
      word-spacing: normal;
      text-transform: none;
      text-indent: 0;
      text-shadow: none;
    }

    img {
      display: inline-block;
      height: auto;
      max-width: 100%;
      vertical-align: middle;
    }

    a {
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      font-style: inherit;
      color: inherit;
      text-decoration: inherit;
    }
  `;
}
