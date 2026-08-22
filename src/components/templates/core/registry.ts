import { lazy } from 'react';
import GenericLandingTemplate from '@/components/templates/landing/_shared/GenericLandingTemplate';
import { LANDING_THEME_DATA } from '@/components/templates/landing/_shared/themeData';
import GenericMenuTemplate from '@/components/templates/menu/_shared/GenericMenuTemplate';
import { MENU_THEME_DATA } from '@/components/templates/menu/_shared/menuThemeData';

// Every landing template is just a hardcoded THEME object handed to BaseTemplate — they all
// share one component (GenericLandingTemplate), parameterized at render time via themeSlug.
const GENERIC_LANDING_ENTRIES = Object.fromEntries(
  Object.keys(LANDING_THEME_DATA).map((slug) => [slug, GenericLandingTemplate])
) as Record<keyof typeof LANDING_THEME_DATA, typeof GenericLandingTemplate>;

// Every menu template is just a hardcoded theme object handed to makeMenuTemplate — they all
// share one component (GenericMenuTemplate), parameterized at render time via themeSlug.
const GENERIC_MENU_ENTRIES = Object.fromEntries(
  Object.keys(MENU_THEME_DATA).map((slug) => [slug, GenericMenuTemplate])
) as Record<keyof typeof MENU_THEME_DATA, typeof GenericMenuTemplate>;

export const landingTemplates = {
  ...GENERIC_LANDING_ENTRIES,
} as const;

export const menuTemplates = {
  ...GENERIC_MENU_ENTRIES,
} as const;
