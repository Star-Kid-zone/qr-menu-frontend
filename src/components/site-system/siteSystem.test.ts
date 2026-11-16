import { describe, it, expect } from 'vitest';
import { resolveSiteLook } from './resolveSiteLook';
import { siteLookCssVars } from './tokens';
import { parseOccasion } from './occasions/activeOccasion';
import { ATTRIBUTE_SETS, ATTRIBUTE_SET_IDS, formatAttributeValue } from './attributes';
import { parseSiteDocument } from '@/components/templates/sections/document';
import type { BusinessTypeDefinition, OccasionDefinition, OccasionEntry, SkinDefinition } from './types';

const skin: SkinDefinition = {
  id: 'test-skin', family: 'royal-classic', label: 'Test', description: '',
  palette: { bg: '#fffaf0', surface: '#ffffff', accent: '#7b2336', accentText: '#ffffff', text: '#1b1226', textMuted: '#5a4a5a', border: '#e5dccb', band: '#f3ead8', footer: '#1b1226' },
  fonts: { display: '"Bodoni Moda",serif', body: '"Inter",sans-serif' },
  headingClass: '',
  shape: { radius: 6, card: 'rounded-md', border: 'hairline', shadow: 'soft' },
  iconStyle: 'engraved',
  ornaments: { divider: 'gilt-rule', frame: 'arch', corner: 'fleuron', pattern: 'damask' },
  background: { texture: 'damask' },
  heroOverlay: 'linear-gradient(#0006,#0003)',
  tempo: 1,
};

const business: BusinessTypeDefinition = {
  id: 'pub', family: 'bars-lounges', label: 'Pub', description: '',
  terms: { catalogLabel: 'Menu', itemSingular: 'Drink', itemPlural: 'Drinks', featuredSectionLabel: 'House favourites', popularSectionLabel: 'On the bar', ctaLabel: 'See the menu', curatedListTitle: 'On tap this week' },
  attributeSets: ['beer', 'spirits', 'wine', 'food'],
  priceOptionPresets: [['Half', 'Pint']],
  categoryIcons: [{ match: ['beer', 'ale', 'lager'], icon: 'pint' }],
  defaultIcon: 'pint',
  copy: { tagline: '', badge: '', marquee: '' },
  recommended: { layouts: ['midnight-diner'], skins: ['test-skin'], menuStructure: 'drinks-list' },
  badges: [],
  alcohol: { ageNotice: 18 },
};

const diwali: OccasionDefinition = {
  id: 'diwali', region: 'india', label: 'Diwali', tints: ['#f2a900', '#c2185b', '#6a1b9a'], ink: '#2b1400',
  ornaments: { corner: 'rangoli', divider: 'diya-row', border: 'marigold' },
  bannerSuggestion: 'Happy Diwali', specialsCategorySuggestion: 'Diwali specials', badgeIcon: 'diya',
};
const entry = (over: Partial<OccasionEntry> = {}): OccasionEntry => ({ id: 'diwali', intensity: 'subtle', ...over });

describe('resolveSiteLook precedence', () => {
  it('uses the skin when nothing else is set', () => {
    const look = resolveSiteLook({ layout: 'grand-hall', skin, business, occasion: null });
    expect(look.palette).toEqual(skin.palette);
    expect(look.layout).toBe('grand-hall');
    expect(look.iconStyle).toBe('engraved');
    expect(look.motion).toBe('full');
  });

  it('owner values override the skin; empty owner values do not', () => {
    const look = resolveSiteLook({ layout: 'x', skin, business, occasion: null, owner: { palette: { accent: '#123456', text: '' }, fonts: { display: '' } } });
    expect(look.palette.accent).toBe('#123456');
    expect(look.palette.text).toBe(skin.palette.text);
    expect(look.fonts.display).toBe(skin.fonts.display);
  });

  it('rule 1: the business type never changes colours, fonts or shape', () => {
    const asPub = resolveSiteLook({ layout: 'x', skin, business, occasion: null });
    const asCafe = resolveSiteLook({ layout: 'x', skin, business: { ...business, id: 'cafe', family: 'cafes-sweets' }, occasion: null });
    expect(asPub.palette).toEqual(asCafe.palette);
    expect(asPub.fonts).toEqual(asCafe.fonts);
    expect(asPub.radius).toBe(asCafe.radius);
  });

  it('rule 2: a subtle occasion leaves the palette alone and only adds --occ-* tokens', () => {
    const look = resolveSiteLook({ layout: 'x', skin, business, occasion: { definition: diwali, entry: entry() }, owner: { palette: { accent: '#123456' } } });
    expect(look.palette.accent).toBe('#123456');
    const vars = siteLookCssVars(look) as Record<string, string>;
    expect(vars['--occ-1']).toBe('#f2a900');
    expect(vars['--occ-ink']).toBe('#2b1400');
    expect(vars['--site-accent']).toBe('#123456');
  });

  it('rule 2: a full occasion sets the accent, over the owner accent', () => {
    const look = resolveSiteLook({ layout: 'x', skin, business, occasion: { definition: diwali, entry: entry({ intensity: 'full' }) }, owner: { palette: { accent: '#123456' } } });
    expect(look.palette.accent).toBe('#f2a900');
    expect(look.palette.accentText).toBe('#2b1400');
  });

  it('no occasion ⇒ no --occ-* tokens', () => {
    const vars = siteLookCssVars(resolveSiteLook({ layout: 'x', skin, business, occasion: null })) as Record<string, string>;
    expect(Object.keys(vars).some((k) => k.startsWith('--occ-'))).toBe(false);
  });

  it('reduced motion always wins over the owner setting, and zeroes the tempo', () => {
    const look = resolveSiteLook({ layout: 'x', skin, business, occasion: null, owner: { motion: 'full' }, prefersReducedMotion: true });
    expect(look.motion).toBe('off');
    expect((siteLookCssVars(look) as Record<string, string>)['--site-tempo']).toBe('0');
  });

  it('keeps the existing --site-* variable names', () => {
    const vars = siteLookCssVars(resolveSiteLook({ layout: 'x', skin, business, occasion: null })) as Record<string, string>;
    for (const name of ['--site-bg', '--site-surface', '--site-section-bg', '--site-footer-bg', '--site-border', '--site-text', '--site-text-muted', '--site-accent', '--site-accent-text', '--site-hero-overlay', '--site-font']) {
      expect(vars[name], name).toBeTruthy();
    }
  });
});

describe('parseOccasion (on while present)', () => {
  it('reads the stored occasion and treats anything malformed as off', () => {
    expect(parseOccasion({ id: 'diwali', intensity: 'full', banner: ' Happy Diwali ' })).toEqual({ id: 'diwali', intensity: 'full', banner: 'Happy Diwali' });
    expect(parseOccasion({ id: 'diwali', intensity: 'loud' })).toBeNull();
    expect(parseOccasion([{ id: 'diwali', intensity: 'full' }])).toBeNull();
    expect(parseOccasion(null)).toBeNull();
    expect(parseOccasion('diwali')).toBeNull();
  });
});

describe('site document keeps the occasion on a round trip', () => {
  it('parseSiteDocument preserves the owner occasion (the studio re-saves parsed documents)', () => {
    const doc = parseSiteDocument({ version: 1, occasion: { id: 'diwali', intensity: 'subtle', banner: 'Happy Diwali' } });
    expect(doc?.occasion).toEqual({ id: 'diwali', intensity: 'subtle', banner: 'Happy Diwali' });
  });
});
/**
 * Same list as qr-backend/.../src/tests/siteSystem.schema.test.ts ("attribute set parity").
 * If this fails, update ATTRIBUTE_SETS on BOTH sides, then this list in BOTH tests.
 */
const ATTRIBUTE_SPEC = [
  'food:serves:int', 'food:vegMark:enum',
  'wine:colour:enum', 'wine:grape:text', 'wine:region:text', 'wine:country:text', 'wine:vintage:int', 'wine:abv:number', 'wine:sweetness:enum', 'wine:body:enum', 'wine:tastingNotes:text', 'wine:pairing:text',
  'beer:style:text', 'beer:brewery:text', 'beer:abv:number', 'beer:ibu:int', 'beer:serve:enum',
  'spirits:baseSpirit:enum', 'spirits:abv:number', 'spirits:flavour:list', 'spirits:glass:text',
  'cheese:milk:enum', 'cheese:texture:enum', 'cheese:age:text', 'cheese:origin:text', 'cheese:rind:text', 'cheese:pasteurised:bool', 'cheese:pairing:text',
  'coffee:origin:text', 'coffee:roast:enum', 'coffee:process:text', 'coffee:notes:text', 'coffee:milkOptions:list',
  'bakery:eggless:bool', 'bakery:weight:text', 'bakery:pieces:int', 'bakery:freshDaily:bool', 'bakery:shelfLifeDays:int',
  'japanese:pieces:int', 'japanese:preparation:enum', 'japanese:fish:text', 'japanese:wasabi:bool',
  'grill:cut:text', 'grill:weight:text', 'grill:grade:text', 'grill:origin:text', 'grill:doneness:enumList',
  'product:brand:text', 'product:origin:text', 'product:size:text', 'product:unitPrice:text', 'product:inStock:bool',
  'shisha:flavour:text', 'shisha:strength:enum',
  'hamper:contents:list', 'hamper:occasion:text', 'hamper:boxSize:text',
];

describe('attribute sets', () => {
  it('match the backend spec (12 sets)', () => {
    expect(ATTRIBUTE_SET_IDS).toHaveLength(12);
    const spec = ATTRIBUTE_SET_IDS.flatMap((id) => ATTRIBUTE_SETS[id].fields.map((f) => `${id}:${f.id}:${f.kind}`));
    expect(spec).toEqual(ATTRIBUTE_SPEC);
  });

  it('formats values for guests', () => {
    const wine = ATTRIBUTE_SETS.wine.fields;
    const f = (id: string) => wine.find((x) => x.id === id)!;
    expect(formatAttributeValue(f('colour'), 'rose')).toBe('Rosé');
    expect(formatAttributeValue(f('abv'), 13.5)).toBe('13.5%');
    expect(formatAttributeValue(f('grape'), '')).toBeNull();
    expect(formatAttributeValue(ATTRIBUTE_SETS.cheese.fields.find((x) => x.id === 'pasteurised')!, false)).toBe('No');
    expect(formatAttributeValue(ATTRIBUTE_SETS.grill.fields.find((x) => x.id === 'doneness')!, ['rare', 'medium'])).toBe('Rare, Medium');
  });
});
