import DOMPurify from 'dompurify';

export function sanitized_inject_HTML(html_string: string): { __html: string } {
  return { __html: DOMPurify.sanitize(html_string) };
}
