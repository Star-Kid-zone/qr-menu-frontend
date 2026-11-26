/**
 * API ids are opaque strings (the backend serializes its bigint keys as strings). Never convert
 * them with Number()/parseInt(): values past 2^53 would silently change. Use this to validate an
 * id that came from outside the API (a route param, a query string) before sending it back.
 */
export function isApiId(value: unknown): value is string {
  return typeof value === "string" && /^\d{1,20}$/.test(value);
}
