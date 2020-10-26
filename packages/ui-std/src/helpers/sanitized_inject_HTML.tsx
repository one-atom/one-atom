import DOMPurify from 'dompurify';

export function sanitizedInjectHTML(html_string: string): { __html: string } {
  return { __html: DOMPurify.sanitize(html_string) };
}
