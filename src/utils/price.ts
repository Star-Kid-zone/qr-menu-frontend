/**
 * Formats a menu price with the restaurant's own currency symbol. The API
 * sends prices as decimal strings ("12.49"), so the value is coerced first.
 */
export function formatPrice(value: number | string | null | undefined, symbol?: string | null): string {
  const amount = Number(value);
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${symbol?.trim() || "$"}${safe.toFixed(2)}`;
}
