export function dangerously_inject_HTML(html_string: string): { __html: string } {
  return { __html: html_string };
}
