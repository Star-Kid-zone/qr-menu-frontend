'use client';
import { MenuTemplateRenderer } from './makeMenuTemplate';
import { MENU_THEME_DATA } from './menuThemeData';
import type { PublicMenuPayload } from '@/types/public/publicSite.types';
import { DEFAULT_TEMPLATE_SLUG } from '@/components/templates/core/defaultTemplate';

const FALLBACK_THEME = MENU_THEME_DATA[DEFAULT_TEMPLATE_SLUG];

/**
 * Single shared renderer for every "flat" menu template — one that's just a
 * theme object handed to MenuTemplateRenderer. The registry maps ~86 slugs to
 * this same component; `themeSlug` (set by TenantMenuPage from the already-resolved
 * registry key) picks which entry of `MENU_THEME_DATA` to render.
 */
export default function GenericMenuTemplate({
  payload,
  routeSlug,
  themeSlug,
}: {
  payload: PublicMenuPayload;
  routeSlug: string | null;
  themeSlug?: string;
}) {
  const theme = (themeSlug && MENU_THEME_DATA[themeSlug]) || FALLBACK_THEME;
  return <MenuTemplateRenderer theme={theme} payload={payload} routeSlug={routeSlug} />;
}
