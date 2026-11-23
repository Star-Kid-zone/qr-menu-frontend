'use client';
import type { LandingTemplateProps } from '@/types/public/templates/rawPublicSiteData.types';
import BaseTemplate from './BaseTemplate';
import { LANDING_THEME_DATA } from './themeData';

/**
 * Single shared renderer for every "flat" landing template — one that's just a
 * `THEME` object handed to `BaseTemplate`. The registry maps ~95 slugs to this
 * same component; `themeSlug` (set by TenantLandingPage from the already-resolved
 * registry key) picks which entry of `LANDING_THEME_DATA` to render.
 */
const FALLBACK_THEME = LANDING_THEME_DATA['swiss-international'];

export default function GenericLandingTemplate(p: LandingTemplateProps) {
  const theme = (p.themeSlug && LANDING_THEME_DATA[p.themeSlug]) || FALLBACK_THEME;
  return <BaseTemplate theme={theme} {...p} />;
}
