import GenericMenuTemplate from '@/components/templates/menu/_shared/GenericMenuTemplate';
import { MENU_THEME_DATA } from '@/components/templates/menu/_shared/menuThemeData';

// Every menu template is just a hardcoded theme object — they all share one component
// (GenericMenuTemplate), parameterized at render time via themeSlug.
// Kept separate from landingRegistry so the menu page doesn't download the landing theme table
// (and vice versa).
const GENERIC_MENU_ENTRIES = Object.fromEntries(
  Object.keys(MENU_THEME_DATA).map((slug) => [slug, GenericMenuTemplate])
) as Record<keyof typeof MENU_THEME_DATA, typeof GenericMenuTemplate>;

export const menuTemplates = {
  ...GENERIC_MENU_ENTRIES,
} as const;
