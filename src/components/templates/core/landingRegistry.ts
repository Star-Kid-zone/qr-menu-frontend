import GenericLandingTemplate from '@/components/templates/landing/_shared/GenericLandingTemplate';
import { LANDING_THEME_DATA } from '@/components/templates/landing/_shared/themeData';

// Every landing template is just a hardcoded THEME object handed to BaseTemplate — they all
// share one component (GenericLandingTemplate), parameterized at render time via themeSlug.
// Kept separate from menuRegistry so the landing page doesn't download the menu theme table
// (and vice versa).
const GENERIC_LANDING_ENTRIES = Object.fromEntries(
  Object.keys(LANDING_THEME_DATA).map((slug) => [slug, GenericLandingTemplate])
) as Record<keyof typeof LANDING_THEME_DATA, typeof GenericLandingTemplate>;

export const landingTemplates = {
  ...GENERIC_LANDING_ENTRIES,
} as const;
