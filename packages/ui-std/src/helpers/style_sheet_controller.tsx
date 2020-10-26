export class StyleSheetController {
  private readonly style_element: HTMLStyleElement;
  private readonly styles = new Set<string>();

  constructor() {
    this.style_element = document.createElement('style');
    this.style_element.type = 'text/css';
    this.style_element.appendChild(document.createTextNode(''));

    document.head.appendChild(this.style_element);
  }

  public addToRegister(selector: string, style: string): StyleSheetController {
    const css_style_sheet = this.style_element.sheet as CSSStyleSheet;

    if (this.styles.has(selector)) return this;

    this.styles.add(selector);

    const newCSSVariables = `
      ${selector} {
        ${style}
      }
    `;

    css_style_sheet.insertRule(newCSSVariables, css_style_sheet.cssRules.length);

    return this;
  }
}
