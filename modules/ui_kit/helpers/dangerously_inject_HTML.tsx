export function dangerouslyInjectHTML(html_string: string): { __html: string } {
  return { __html: html_string };
}
