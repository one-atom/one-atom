export function safeJsonParse<T>(data: any): T {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    return data;
  }
}
