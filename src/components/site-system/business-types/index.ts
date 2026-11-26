import type { BusinessFamily, BusinessTypeDefinition } from '../types';
import { BUSINESS_FAMILIES } from '../types';
import { BUSINESS_TYPES } from './definitions';

export { BUSINESS_TYPES } from './definitions';
export { categoryIcon, iconForCategory, GENERIC_CATEGORY_ICONS } from './categoryIcons';

const BY_ID: ReadonlyMap<string, BusinessTypeDefinition> = new Map(BUSINESS_TYPES.map((b) => [b.id, b]));

const GENERIC_BUSINESS_TYPE_ID = 'generic';

export function getBusinessType(id: string | null | undefined): BusinessTypeDefinition | null {
  return (id && BY_ID.get(id)) || null;
}

/**
 * The 14 starter kits (sections/kits/kits.ts) are now recipes: a kit picks a
 * layout, skin and menu structure *and* a business type. Kit id → type id.
 */
export const KIT_BUSINESS_TYPE: Readonly<Record<string, string>> = {
  'italian-trattoria': 'italian-trattoria',
  pizzeria: 'pizzeria',
  'arabian-mandi': 'arabian-mandi',
  'north-indian': 'north-indian',
  'south-indian': 'south-indian',
  'burger-joint': 'burger-joint',
  cafe: 'cafe',
  japanese: 'japanese',
  'lebanese-mezze': 'lebanese-mezze',
  'turkish-grill': 'turkish-grill',
  chinese: 'chinese',
  'mexican-taqueria': 'mexican',
  steakhouse: 'steakhouse',
  seafood: 'seafood',
};

/**
 * The business type a site uses: the saved `business_type`, else the type of
 * the kit the site was started from (`site_document.kit`), else generic.
 * Existing sites therefore get sensible words and icons without any change.
 */
export function resolveBusinessType(settings: Record<string, unknown> | null | undefined): BusinessTypeDefinition {
  const s = settings ?? {};
  const saved = typeof s.business_type === 'string' ? getBusinessType(s.business_type.trim()) : null;
  if (saved) return saved;
  const doc = s.site_document as { kit?: unknown } | null | undefined;
  const kit = doc && typeof doc === 'object' && typeof doc.kit === 'string' ? doc.kit : '';
  return getBusinessType(KIT_BUSINESS_TYPE[kit]) ?? (BY_ID.get(GENERIC_BUSINESS_TYPE_ID) as BusinessTypeDefinition);
}

/** Types grouped by family, in catalogue order (for the studio's business type picker). */
export function businessTypesByFamily(): Record<BusinessFamily, BusinessTypeDefinition[]> {
  const out = Object.fromEntries(BUSINESS_FAMILIES.map((f) => [f, [] as BusinessTypeDefinition[]])) as Record<BusinessFamily, BusinessTypeDefinition[]>;
  for (const b of BUSINESS_TYPES) out[b.family].push(b);
  return out;
}
