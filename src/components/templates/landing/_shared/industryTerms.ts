export type VerticalTerms = {
  /** Nav/button word for the tenant's full offering, e.g. "Menu" / "Services" / "Catalog". */
  catalogLabel: string;
  itemSingular: string;
  itemPlural: string;
  /** Replaces "Signature Dishes". */
  featuredSectionLabel: string;
  /** Replaces "What We're Known For". */
  featuredSectionSubhead: string;
  /** Replaces "From Our Menu". */
  popularSectionLabel: string;
  /** Replaces "Popular Right Now". */
  popularSectionSubhead: string;
  /** Replaces "Explore Menu" / "See Full Menu". */
  ctaLabel: string;
  /** Replaces alt="Our restaurant". */
  heroAlt: string;
};

// Keep keys in sync with the `group` values in
// updatedbackend/src/db/laravelSeedConstants.ts.
const INDUSTRY_GROUP_TERMS: Record<string, VerticalTerms> = {
  food_beverage: {
    catalogLabel: 'Menu',
    itemSingular: 'Dish',
    itemPlural: 'Dishes',
    featuredSectionLabel: 'Signature Dishes',
    featuredSectionSubhead: "What We're Known For",
    popularSectionLabel: 'From Our Menu',
    popularSectionSubhead: 'Popular Right Now',
    ctaLabel: 'Explore Menu',
    heroAlt: 'Our restaurant',
  },
  personal_care: {
    catalogLabel: 'Services',
    itemSingular: 'Service',
    itemPlural: 'Services',
    featuredSectionLabel: 'Signature Services',
    featuredSectionSubhead: "What We're Known For",
    popularSectionLabel: 'Our Services',
    popularSectionSubhead: 'Most Booked',
    ctaLabel: 'Explore Services',
    heroAlt: 'Our studio',
  },
  health_fitness: {
    catalogLabel: 'Programs',
    itemSingular: 'Program',
    itemPlural: 'Programs',
    featuredSectionLabel: 'Featured Programs',
    featuredSectionSubhead: "What We're Known For",
    popularSectionLabel: 'Our Programs',
    popularSectionSubhead: 'Most Popular',
    ctaLabel: 'Explore Programs',
    heroAlt: 'Our facility',
  },
  retail: {
    catalogLabel: 'Collection',
    itemSingular: 'Product',
    itemPlural: 'Products',
    featuredSectionLabel: 'Featured Pieces',
    featuredSectionSubhead: "What We're Known For",
    popularSectionLabel: 'From Our Collection',
    popularSectionSubhead: 'Popular Right Now',
    ctaLabel: 'Explore Collection',
    heroAlt: 'Our store',
  },
  hospitality_travel: {
    catalogLabel: 'Experiences',
    itemSingular: 'Experience',
    itemPlural: 'Experiences',
    featuredSectionLabel: 'Signature Experiences',
    featuredSectionSubhead: "What We're Known For",
    popularSectionLabel: 'Our Offerings',
    popularSectionSubhead: 'Popular Right Now',
    ctaLabel: 'Explore Experiences',
    heroAlt: 'Our property',
  },
  professional_services: {
    catalogLabel: 'Services',
    itemSingular: 'Service',
    itemPlural: 'Services',
    featuredSectionLabel: 'Featured Services',
    featuredSectionSubhead: "What We're Known For",
    popularSectionLabel: 'Our Services',
    popularSectionSubhead: 'Most Requested',
    ctaLabel: 'Explore Services',
    heroAlt: 'Our studio',
  },
  events_entertainment: {
    catalogLabel: 'Offerings',
    itemSingular: 'Package',
    itemPlural: 'Packages',
    featuredSectionLabel: 'Featured Packages',
    featuredSectionSubhead: "What We're Known For",
    popularSectionLabel: 'Our Offerings',
    popularSectionSubhead: 'Popular Right Now',
    ctaLabel: 'Explore Offerings',
    heroAlt: 'Our venue',
  },
  automotive: {
    catalogLabel: 'Services',
    itemSingular: 'Service',
    itemPlural: 'Services',
    featuredSectionLabel: 'Featured Services',
    featuredSectionSubhead: "What We're Known For",
    popularSectionLabel: 'Our Services',
    popularSectionSubhead: 'Most Requested',
    ctaLabel: 'Explore Services',
    heroAlt: 'Our shop',
  },
};

const DEFAULT_GROUP = 'food_beverage';

/**
 * Resolves the landing page's terminology set for a tenant's industry group.
 * Falls back to the food & beverage set (today's original restaurant copy)
 * when the group is missing/unrecognized, so existing restaurant tenants
 * see zero change.
 */
export function resolveTerms(industryGroup?: string | null): VerticalTerms {
  return INDUSTRY_GROUP_TERMS[industryGroup ?? ''] ?? INDUSTRY_GROUP_TERMS[DEFAULT_GROUP];
}
