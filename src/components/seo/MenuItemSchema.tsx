import React from 'react';
import type { Menu } from '@/types';
import { DIET_SCHEMA_MAP } from '@/constants/dietary.constants';

/**
 * schema.org `Menu` JSON-LD for the guest-facing menu page — one `MenuItem`
 * entry per dish (grouped into `MenuSection`s by category), each carrying
 * whatever structured data actually exists (price always; description,
 * image, nutrition/calories only when set). There's no individual per-dish
 * page yet, so this is the aggregate equivalent recommended as the
 * lower-effort first step — a future dedicated dish route can add its own
 * MenuItem+Offer schema without needing to remove this one.
 */
export function MenuItemSchema({
  menuItems,
  businessName,
  url,
  currencyCode = 'USD',
}: {
  menuItems: Menu[];
  businessName: string;
  url: string;
  currencyCode?: string;
}) {
  const available = menuItems.filter((m) => m.item && m.item.trim().length > 0);
  if (available.length === 0) return null;

  const byCategory = new Map<string, Menu[]>();
  for (const item of available) {
    const cat = item.category?.trim() || 'Menu';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(item);
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${businessName} Menu`,
    url: `${url}/menu`,
    hasMenuSection: Array.from(byCategory.entries()).map(([category, items]) => ({
      '@type': 'MenuSection',
      name: category,
      hasMenuItem: items.map((item) => {
        const menuItem: Record<string, unknown> = {
          '@type': 'MenuItem',
          name: item.item,
        };
        if (item.description) menuItem.description = item.description;
        const price = Number(item.price);
        if (Number.isFinite(price) && price > 0) {
          menuItem.offers = { '@type': 'Offer', price: price.toFixed(2), priceCurrency: currencyCode };
        }
        if (item.calories != null) {
          menuItem.nutrition = { '@type': 'NutritionInformation', calories: `${item.calories} cal` };
        }
        if (item.dietaryTags && item.dietaryTags.length > 0) {
          menuItem.suitableForDiet = item.dietaryTags
            .map((tag) => DIET_SCHEMA_MAP[tag])
            .filter((v): v is string => Boolean(v));
        }
        return menuItem;
      }),
    })),
  };

  const json = JSON.stringify(schema).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}


