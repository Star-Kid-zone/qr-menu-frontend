import type { RawPublicSiteData } from '@/types/public/templates/rawPublicSiteData.types';
import { LANDING_POPULAR_COUNT, LANDING_SIGNATURE_COUNT } from '@/constants/site.constants';

/** Every `itemIds` list anywhere in the site document (curated-list section props). */
function collectCuratedIds(node: unknown, into: Set<string>): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) collectCuratedIds(child, into);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === 'itemIds' && Array.isArray(value)) value.forEach((id) => into.add(String(id)));
    else collectCuratedIds(value, into);
  }
}

function parseDocument(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * The landing page's data with only the dishes a landing section can show: the first
 * LANDING_SIGNATURE_COUNT dishes (signature), the first LANDING_POPULAR_COUNT popular dishes (or
 * the first LANDING_POPULAR_COUNT dishes when none is popular), and every dish a curated list
 * names. Kept in the original order, so every section picks exactly the same dishes as with the
 * full menu — but the page no longer ships the whole menu to the browser.
 */
export function toLandingData(data: RawPublicSiteData): RawPublicSiteData {
  const items = Array.isArray(data.menuItems) ? data.menuItems : [];
  const keep = new Set<number>();

  for (let i = 0; i < Math.min(LANDING_SIGNATURE_COUNT, items.length); i++) keep.add(i);

  const anyPopular = items.some((m) => m?.popular);
  let popular = 0;
  items.forEach((m, i) => {
    if (popular < LANDING_POPULAR_COUNT && (!anyPopular || m?.popular)) {
      keep.add(i);
      popular++;
    }
  });

  const curated = new Set<string>();
  collectCuratedIds(parseDocument((data.settings as Record<string, unknown> | undefined)?.site_document), curated);
  items.forEach((m, i) => {
    if (m?.id !== undefined && curated.has(String(m.id))) keep.add(i);
  });

  return { ...data, menuItems: items.filter((_, i) => keep.has(i)) };
}
