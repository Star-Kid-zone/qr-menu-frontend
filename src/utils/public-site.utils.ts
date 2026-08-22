import type { Menu } from '@/types';

/**
 * Formats a complex price object or string/number into a consistent decimal string.
 * Handles cases where price is a Prisma Decimal object or raw value.
 */
export function formatDecimalPrice(price: unknown): string {
  if (typeof price === 'string' || typeof price === 'number') return String(price);
  
  if (price && typeof price === 'object' && Array.isArray((price as { d?: unknown[] }).d)) {
    const digits = (price as { d: unknown[] }).d;
    const integerPart = digits[0];
    const fractionPart = digits[1];
    
    if (fractionPart !== undefined && fractionPart !== 0) {
      // Ensure fraction is padded and then truncated to 2 decimals
      const formattedFrac = String(fractionPart).padStart(7, '0').replace(/0+$/, '');
      return `${integerPart}.${formattedFrac.substring(0, 2)}`;
    }
    return String(integerPart);
  }
  
  return '0';
}

/**
 * Normalizes an array of menu items by ensuring their prices are formatted as strings.
 */
export function normalizeMenuItems(raw: unknown): Menu[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => ({
    ...(item as Menu),
    price: formatDecimalPrice((item as { price?: unknown }).price),
  }));
}
