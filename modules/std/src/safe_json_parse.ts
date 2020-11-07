/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable @typescript-eslint/explicit-module-boundary-types*/

export function safeJsonParse<T>(data: any): T {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    return data;
  }
}
