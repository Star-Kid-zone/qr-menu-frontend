import type { LoadingScreenOption, LoadingScreenTheme } from './types';

export const LOADING_SCREEN_OPTIONS: LoadingScreenOption[] = [
  { value: 'circular', label: 'Circular Default', group: 'Default', description: 'Keep the classic spinner fallback.', accent: '#0F766E' },
  { value: 'universal-orbit', label: 'Orbit Glow', group: 'Universal', description: 'A premium orbital ring for any brand.', accent: '#0EA5E9' },
  { value: 'universal-wave', label: 'Wave Bars', group: 'Universal', description: 'Rhythmic bars that feel energetic and modern.', accent: '#7C3AED' },
  { value: 'universal-grid', label: 'Grid Flow', group: 'Universal', description: 'Modular squares with a clean, structured pulse.', accent: '#16A34A' },
  { value: 'universal-pulse', label: 'Pulse Rings', group: 'Universal', description: 'Soft concentric rings for calm transitions.', accent: '#EC4899' },
  { value: 'retail-bag', label: 'Retail Bag', group: 'Retail', description: 'A subtle shopping-bag motion for commerce brands.', accent: '#F59E0B' },
  { value: 'wellness-leaf', label: 'Wellness Leaf', group: 'Wellness', description: 'Natural motion for spas, wellness, and beauty.', accent: '#10B981' },
  { value: 'tech-orbit', label: 'Tech Orbit', group: 'Technology', description: 'A crisp orbital loader with a digital feel.', accent: '#38BDF8' },
  { value: 'hospitality-bell', label: 'Hospitality Bell', group: 'Hospitality', description: 'A refined pulse for hotels and guest-first brands.', accent: '#F97316' },
  { value: 'salon-mirror', label: 'Salon Mirror', group: 'Beauty', description: 'Reflective shimmer and soft geometry.', accent: '#EC4899' },
  { value: 'clinic-cross', label: 'Clinic Cross', group: 'Health', description: 'Trust-forward motion for clinics and services.', accent: '#14B8A6' },
  { value: 'restaurant-flame', label: 'Flame Rise', group: 'Restaurant', description: 'A warm flame motion for grill-led concepts.', accent: '#FB7185' },
  { value: 'restaurant-steam', label: 'Steam Lift', group: 'Restaurant', description: 'Soft steam lines for hot plated dishes.', accent: '#FDBA74' },
  { value: 'restaurant-plate', label: 'Plate Orbit', group: 'Restaurant', description: 'Plate-focused motion for refined dining.', accent: '#F59E0B' },
  { value: 'restaurant-bento', label: 'Bento Blocks', group: 'Restaurant', description: 'A modular plate-and-card loader for modern menus.', accent: '#8B5CF6' },
  { value: 'restaurant-pizza', label: 'Pizza Spin', group: 'Restaurant', description: 'A fast, playful slice animation.', accent: '#F97316' },
  { value: 'restaurant-burger', label: 'Burger Stack', group: 'Restaurant', description: 'Layered motion for burger and casual dining brands.', accent: '#FACC15' },
  { value: 'restaurant-sushi', label: 'Sushi Belt', group: 'Restaurant', description: 'A smooth conveyor motion inspired by sushi bars.', accent: '#0EA5E9' },
  { value: 'restaurant-bakery', label: 'Bakery Rise', group: 'Restaurant', description: 'Gentle rising arcs for bakeries and pastry shops.', accent: '#FDE68A' },
  { value: 'restaurant-noodle', label: 'Noodle Swirl', group: 'Restaurant', description: 'A flowing noodle loop for Asian concepts.', accent: '#FB923C' },
  { value: 'restaurant-grill', label: 'Grill Heat', group: 'Restaurant', description: 'A sizzling glow for steakhouse and grill brands.', accent: '#EF4444' },
  { value: 'restaurant-cocktail', label: 'Cocktail Shake', group: 'Restaurant', description: 'A premium shake for bar and lounge concepts.', accent: '#22C55E' },
  { value: 'restaurant-tandoor', label: 'Tandoor Glow', group: 'Restaurant', description: 'A glowing ember motion for tandoor kitchens.', accent: '#F97316' },
  { value: 'restaurant-bubble-tea', label: 'Bubble Tea Pop', group: 'Restaurant', description: 'Floating bubbles for dessert drinks and cafes.', accent: '#A78BFA' },
  { value: 'restaurant-seafood', label: 'Seafood Drift', group: 'Restaurant', description: 'A gentle wave motion for seafood brands.', accent: '#06B6D4' },
  { value: 'restaurant-dessert', label: 'Dessert Spark', group: 'Restaurant', description: 'A sweet twinkle for dessert-forward menus.', accent: '#F472B6' },
  { value: 'restaurant-curry', label: 'Curry Sizzle', group: 'Restaurant', description: 'A warm simmer for spice-driven kitchens.', accent: '#F59E0B' },
  { value: 'restaurant-asian', label: 'Asian Flow', group: 'Restaurant', description: 'A balanced motion for broader Asian dining.', accent: '#14B8A6' },
  { value: 'restaurant-mediterranean', label: 'Mediterranean Sun', group: 'Restaurant', description: 'Bright and airy motion for Mediterranean concepts.', accent: '#0EA5E9' },
];

export const DEFAULT_LOADING_SCREEN_THEME: LoadingScreenTheme = 'circular';

export const LOADING_SCREEN_GROUP_ORDER = [
  'Default',
  'Restaurant',
  'Universal',
  'Retail',
  'Hospitality',
  'Wellness',
  'Technology',
  'Beauty',
  'Health',
] as const;

type LoadingScreenGroupOption = {
  group: string;
  options: LoadingScreenOption[];
};

export function normalizeLoadingScreenTheme(value?: string | null): LoadingScreenTheme {
  const raw = String(value ?? '').trim();
  if (!raw) return DEFAULT_LOADING_SCREEN_THEME;

  if (raw === 'restaurant-mediterannean') {
    return 'restaurant-mediterranean';
  }

  return (
    LOADING_SCREEN_OPTIONS.find((option) => option.value === raw)?.value ??
    DEFAULT_LOADING_SCREEN_THEME
  );
}

export function getLoadingScreenOption(value: string | null | undefined) {
  const normalized = normalizeLoadingScreenTheme(value);
  return LOADING_SCREEN_OPTIONS.find((option) => option.value === normalized) ?? LOADING_SCREEN_OPTIONS[0]!;
}

export function groupLoadingScreenOptions(options = LOADING_SCREEN_OPTIONS) {
  const grouped: LoadingScreenGroupOption[] = LOADING_SCREEN_GROUP_ORDER.map((group) => ({
    group,
    options: options.filter((option) => option.group === group),
  })).filter((entry) => entry.options.length > 0);

  const knownGroups = new Set(grouped.map((entry) => entry.group));
  const remainingGroups = Array.from(new Set(options.map((option) => option.group))).filter(
    (group) => !knownGroups.has(group)
  );

  return grouped.concat(
    remainingGroups.map((group) => ({
      group,
      options: options.filter((option) => option.group === group),
    })) as LoadingScreenGroupOption[]
  );
}

export function getLoadingScreenGroupHint(industryName?: string | null): string | null {
  const value = String(industryName ?? '').toLowerCase();
  if (!value) return null;
  if (/(restaurant|food|cafe|coffee|bar|hotel|dining|menu|kitchen|bistro|grill|bakery|pizza|sushi|dessert|catering)/.test(value)) {
    return 'Restaurant';
  }
  if (/(retail|shop|store|market|mall|boutique|commerce)/.test(value)) {
    return 'Retail';
  }
  if (/(spa|salon|beauty|wellness|clinic|health|medical|fitness|gym)/.test(value)) {
    return /(clinic|health|medical|fitness|gym)/.test(value) ? 'Health' : 'Wellness';
  }
  if (/(hotel|hospitality|travel|resort|event|venue)/.test(value)) {
    return 'Hospitality';
  }
  if (/(tech|software|app|digital|it|saas|startup)/.test(value)) {
    return 'Technology';
  }

  return null;
}
