import type { AttributeSetId } from './types';

/**
 * Item attribute sets (docs/site-system/PLAN.md §2.2). Mirrors
 * `ATTRIBUTE_SETS` in qr-backend/.../validation/schemas/menuAttributes.schema.ts
 * — same set ids, field ids, kinds and options. A test checks the counts.
 *
 * `label` and option labels are what owners and guests read.
 */

export type AttributeFieldKind = 'text' | 'number' | 'int' | 'bool' | 'enum' | 'list' | 'enumList';

export interface AttributeFieldDef {
  id: string;
  label: string;
  kind: AttributeFieldKind;
  options?: ReadonlyArray<{ value: string; label: string }>;
  min?: number;
  max?: number;
  /** Shown after the value, e.g. "%" for ABV. */
  unit?: string;
  /** Offered as a guest filter on the menu page. */
  filter?: boolean;
}

export interface AttributeSetDef {
  id: AttributeSetId;
  label: string;
  fields: readonly AttributeFieldDef[];
}

const opts = (...pairs: Array<[string, string]>) => pairs.map(([value, label]) => ({ value, label }));

export const ATTRIBUTE_SETS: Record<AttributeSetId, AttributeSetDef> = {
  food: {
    id: 'food', label: 'Food details',
    fields: [
      { id: 'serves', label: 'Serves', kind: 'int', min: 1, max: 50 },
      { id: 'vegMark', label: 'Veg mark', kind: 'enum', options: opts(['veg', 'Veg'], ['non-veg', 'Non-veg'], ['egg', 'Contains egg']), filter: true },
    ],
  },
  wine: {
    id: 'wine', label: 'Wine',
    fields: [
      { id: 'colour', label: 'Colour', kind: 'enum', filter: true,
        options: opts(['red', 'Red'], ['white', 'White'], ['rose', 'Rosé'], ['sparkling', 'Sparkling'], ['orange', 'Orange'], ['dessert', 'Dessert']) },
      { id: 'grape', label: 'Grape', kind: 'text', filter: true },
      { id: 'region', label: 'Region', kind: 'text' },
      { id: 'country', label: 'Country', kind: 'text', filter: true },
      { id: 'vintage', label: 'Vintage', kind: 'int', min: 1800, max: 2100 },
      { id: 'abv', label: 'ABV', kind: 'number', min: 0, max: 100, unit: '%' },
      { id: 'sweetness', label: 'Sweetness', kind: 'enum', options: opts(['dry', 'Dry'], ['off-dry', 'Off-dry'], ['medium', 'Medium'], ['sweet', 'Sweet']) },
      { id: 'body', label: 'Body', kind: 'enum', options: opts(['light', 'Light'], ['medium', 'Medium'], ['full', 'Full']) },
      { id: 'tastingNotes', label: 'Tasting notes', kind: 'text' },
      { id: 'pairing', label: 'Goes with', kind: 'text' },
    ],
  },
  beer: {
    id: 'beer', label: 'Beer and cider',
    fields: [
      { id: 'style', label: 'Style', kind: 'text', filter: true },
      { id: 'brewery', label: 'Brewery', kind: 'text' },
      { id: 'abv', label: 'ABV', kind: 'number', min: 0, max: 100, unit: '%' },
      { id: 'ibu', label: 'Bitterness (IBU)', kind: 'int', min: 0, max: 200 },
      { id: 'serve', label: 'Served', kind: 'enum', filter: true, options: opts(['tap', 'On tap'], ['bottle', 'Bottle'], ['can', 'Can']) },
    ],
  },
  spirits: {
    id: 'spirits', label: 'Spirits and cocktails',
    fields: [
      { id: 'baseSpirit', label: 'Base spirit', kind: 'enum', filter: true,
        options: opts(['gin', 'Gin'], ['vodka', 'Vodka'], ['rum', 'Rum'], ['tequila', 'Tequila'], ['whisky', 'Whisky'], ['brandy', 'Brandy'], ['liqueur', 'Liqueur'], ['mezcal', 'Mezcal'], ['other', 'Other'], ['none', 'Alcohol-free']) },
      { id: 'abv', label: 'ABV', kind: 'number', min: 0, max: 100, unit: '%' },
      { id: 'flavour', label: 'Flavour', kind: 'list' },
      { id: 'glass', label: 'Glass', kind: 'text' },
    ],
  },
  cheese: {
    id: 'cheese', label: 'Cheese',
    fields: [
      { id: 'milk', label: 'Milk', kind: 'enum', filter: true,
        options: opts(['cow', 'Cow'], ['goat', 'Goat'], ['sheep', 'Sheep'], ['buffalo', 'Buffalo'], ['mixed', 'Mixed']) },
      { id: 'texture', label: 'Texture', kind: 'enum', filter: true,
        options: opts(['fresh', 'Fresh'], ['soft', 'Soft'], ['semi-soft', 'Semi-soft'], ['semi-hard', 'Semi-hard'], ['hard', 'Hard'], ['blue', 'Blue']) },
      { id: 'age', label: 'Aged', kind: 'text' },
      { id: 'origin', label: 'Origin', kind: 'text', filter: true },
      { id: 'rind', label: 'Rind', kind: 'text' },
      { id: 'pasteurised', label: 'Pasteurised', kind: 'bool' },
      { id: 'pairing', label: 'Goes with', kind: 'text' },
    ],
  },
  coffee: {
    id: 'coffee', label: 'Coffee and tea',
    fields: [
      { id: 'origin', label: 'Origin', kind: 'text', filter: true },
      { id: 'roast', label: 'Roast', kind: 'enum', filter: true, options: opts(['light', 'Light'], ['medium', 'Medium'], ['dark', 'Dark']) },
      { id: 'process', label: 'Process', kind: 'text' },
      { id: 'notes', label: 'Tasting notes', kind: 'text' },
      { id: 'milkOptions', label: 'Milk options', kind: 'list' },
    ],
  },
  bakery: {
    id: 'bakery', label: 'Bakery and sweets',
    fields: [
      { id: 'eggless', label: 'Eggless', kind: 'bool', filter: true },
      { id: 'weight', label: 'Weight', kind: 'text' },
      { id: 'pieces', label: 'Pieces', kind: 'int', min: 1, max: 500 },
      { id: 'freshDaily', label: 'Made fresh daily', kind: 'bool' },
      { id: 'shelfLifeDays', label: 'Keeps for (days)', kind: 'int', min: 0, max: 365 },
    ],
  },
  japanese: {
    id: 'japanese', label: 'Sushi and Japanese',
    fields: [
      { id: 'pieces', label: 'Pieces', kind: 'int', min: 1, max: 100 },
      { id: 'preparation', label: 'Preparation', kind: 'enum', filter: true, options: opts(['raw', 'Raw'], ['seared', 'Seared'], ['cooked', 'Cooked']) },
      { id: 'fish', label: 'Fish', kind: 'text' },
      { id: 'wasabi', label: 'Contains wasabi', kind: 'bool' },
    ],
  },
  grill: {
    id: 'grill', label: 'Grill and meat',
    fields: [
      { id: 'cut', label: 'Cut', kind: 'text', filter: true },
      { id: 'weight', label: 'Weight', kind: 'text' },
      { id: 'grade', label: 'Grade', kind: 'text' },
      { id: 'origin', label: 'Origin', kind: 'text' },
      { id: 'doneness', label: 'Cooked to', kind: 'enumList',
        options: opts(['rare', 'Rare'], ['medium-rare', 'Medium rare'], ['medium', 'Medium'], ['medium-well', 'Medium well'], ['well-done', 'Well done']) },
    ],
  },
  product: {
    id: 'product', label: 'Product',
    fields: [
      { id: 'brand', label: 'Brand', kind: 'text', filter: true },
      { id: 'origin', label: 'Origin', kind: 'text', filter: true },
      { id: 'size', label: 'Size', kind: 'text' },
      { id: 'unitPrice', label: 'Unit price', kind: 'text' },
      { id: 'inStock', label: 'In stock', kind: 'bool', filter: true },
    ],
  },
  shisha: {
    id: 'shisha', label: 'Shisha',
    fields: [
      { id: 'flavour', label: 'Flavour', kind: 'text', filter: true },
      { id: 'strength', label: 'Strength', kind: 'enum', filter: true, options: opts(['light', 'Light'], ['medium', 'Medium'], ['strong', 'Strong']) },
    ],
  },
  hamper: {
    id: 'hamper', label: 'Hampers and gifts',
    fields: [
      { id: 'contents', label: "What's inside", kind: 'list' },
      { id: 'occasion', label: 'Occasion', kind: 'text', filter: true },
      { id: 'boxSize', label: 'Box size', kind: 'text' },
    ],
  },
};

export const ATTRIBUTE_SET_IDS = Object.keys(ATTRIBUTE_SETS) as AttributeSetId[];

/** A stored value as guests read it ("14.5%", "Rosé", "Yes"); null when empty or not displayable. */
export function formatAttributeValue(field: AttributeFieldDef, value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  const label = (v: string) => field.options?.find((o) => o.value === v)?.label ?? v;
  switch (field.kind) {
    case 'bool':
      return value === true ? 'Yes' : value === false ? 'No' : null;
    case 'enum':
      return typeof value === 'string' ? label(value) : null;
    case 'list':
    case 'enumList':
      return Array.isArray(value) && value.length
        ? value.filter((v): v is string => typeof v === 'string').map(label).join(', ')
        : null;
    case 'number':
    case 'int':
      return typeof value === 'number' && Number.isFinite(value) ? `${value}${field.unit ?? ''}` : null;
    case 'text':
      return typeof value === 'string' ? value : null;
  }
}
