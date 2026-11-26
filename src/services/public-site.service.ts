import 'server-only';

import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { SERVER_API_BASE_URL, getTenantPublicUrl } from '@/config/app.constants';
import { mapPublicUserDetailsFromApi } from '@/components/templates/core/mapPublicUserDetails';
import { MappedPublicUserDetails } from '@/types/public/templates/mapPublicUserDetails.types';
import type { RawPublicSiteData } from '@/types/public/templates/rawPublicSiteData.types';
import type { Menu } from '@/types';
import type { PublicMenuPayload, PublicSitemapSlug, PortalResponse } from '@/types/public/publicSite.types';

export type { PublicSitemapSlug };
import { PUBLIC_LANDING_PATH, PUBLIC_MENU_PATH } from '@/components/templates/core/paths';

// Guest pages are cached for up to a minute and invalidated immediately on
// any admin edit via on-demand revalidation (see revalidatePortal on the
// backend + /api/revalidate below) — this restores real ISR/CDN caching
// instead of re-fetching from the API on every single guest request.
import { PUBLIC_REVALIDATE_SECONDS } from '@/constants/app.constants';
import { PORTAL_TAG_PREFIX } from '@/constants/site.constants';


/** A non-2xx answer from the public API, keeping the status so callers can tell "no such site" from "backend down". */
class PublicApiError extends Error {
  constructor(readonly path: string, readonly status: number) {
    super(`Request failed for ${path}: ${status}`);
    this.name = 'PublicApiError';
  }
}

/**
 * True when the API said the site does not exist (any 4xx). Network failures
 * and 5xx are NOT "missing": treating them as missing would 404 every guest
 * page during a backend outage, so they are rethrown to the error boundary.
 */
function isMissingSiteError(err: unknown): boolean {
  return err instanceof PublicApiError && err.status >= 400 && err.status < 500;
}

async function fetchJson(path: string, init?: RequestInit & { revalidate?: number; tags?: string[] }) {
  const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
    ...init,
    next: { revalidate: init?.revalidate ?? PUBLIC_REVALIDATE_SECONDS, tags: init?.tags },
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new PublicApiError(path, response.status);
  }

  const json = await response.json();
  if (
    json &&
    typeof json === 'object' &&
    !Array.isArray(json) &&
    json.success === true &&
    'data' in json
  ) {
    return json.data as Promise<{ data?: unknown }>;
  }

  return json as Promise<{ data?: unknown }>;
}

function isPlainObject(v: unknown): boolean {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

export const getRawLandingWithMenuBySlug = cache(async (slug: string): Promise<RawPublicSiteData> => {
  const normalizedSlug = slug.trim().toLowerCase();
  const portalResponse = await fetchJson(`/public/portal/${encodeURIComponent(slug.trim())}`, {
    tags: [`${PORTAL_TAG_PREFIX}${normalizedSlug}`],
  });
  if (!portalResponse) throw new Error('Empty response');
  const portal = portalResponse as PortalResponse;

  // Flatten the grouped menu for the legacy templates
  // `image_url` is `null` (not absent) when the item has no photo.
  const menuItems: Array<Omit<Menu, 'image_url'> & { image_url: string | null }> = [];
  const portalMenu = portal.menu;
  if (portalMenu) {
    Object.keys(portalMenu).forEach(category => {
      portalMenu[category].forEach((item) => {
        menuItems.push({
          id: String(item.id),
          item: item.item,
          description: item.description ?? '',
          price: String(item.price ?? '0'),
          type: item.type ?? '',
          category,
          popular: Boolean(item.popular),
          availability: true,                // backend strips this field; default to true
          image_url: item.imageUrl ?? null,  // API uses camelCase, Menu type uses snake_case
          images: Array.isArray(item.images) ? item.images : [],
          videos: Array.isArray(item.videos) ? item.videos : [],
          dietaryTags: Array.isArray(item.dietaryTags) ? item.dietaryTags : [],
          allergens: Array.isArray(item.allergens) ? item.allergens : [],
          spiceLevel: typeof item.spiceLevel === 'number' ? item.spiceLevel : null,
          calories: typeof item.calories === 'number' ? item.calories : null,
          attributes: isPlainObject(item.attributes) ? (item.attributes as Menu['attributes']) : {},
          priceOptions: Array.isArray(item.priceOptions) ? (item.priceOptions as Menu['priceOptions']) : [],
        });
      });
    });
  }

  return {
    user_id: String(portal.portalInfo.userId),
    settings: {
      id: String(portal.portalInfo.workspaceId),
      public_slug: slug,
      landing_theme: portal.portalInfo.landingTheme,
      landing_structure: portal.portalInfo.landingStructure,
      menu_structure: portal.portalInfo.menuStructure,
      menu_theme: portal.portalInfo.menuTheme,
      loading_screen_theme: portal.portalInfo.loadingScreenTheme,
      // Site system ('' = not chosen yet; the renderer falls back to the legacy theme / generic type)
      skin_id:              portal.portalInfo.skinId ?? '',
      menu_skin_id:         portal.portalInfo.menuSkinId ?? '',
      business_type:        portal.portalInfo.businessType ?? '',
      amenities:            Array.isArray(portal.portalInfo.amenities) ? portal.portalInfo.amenities : [],
      theme_colour: portal.portalInfo.themeColour,
      primary_color:        portal.portalInfo.primaryColor,
      secondary_color:      portal.portalInfo.secondaryColor,
      accent_color:         portal.portalInfo.accentColor,
      text_primary_color:   portal.portalInfo.textPrimaryColor,
      text_secondary_color: portal.portalInfo.textSecondaryColor,
      accent_text_color:    portal.portalInfo.accentTextColor,
      border_color:         portal.portalInfo.borderColor,
      footer_bg_color:      portal.portalInfo.footerBgColor,
      section_bg_color:     portal.portalInfo.sectionBgColor,
      font_family:          portal.portalInfo.fontFamily,
      card_style:           portal.portalInfo.cardStyle,
      hero_overlay:         portal.portalInfo.heroOverlay,
      heading_class:        portal.portalInfo.headingClass,
      theme_badge:          portal.portalInfo.themeBadge,
      theme_marquee:        portal.portalInfo.themeMarquee,
      hero_tagline:         portal.portalInfo.heroTagline,
      story_headline:       portal.portalInfo.storyHeadline,
      story_body:           portal.portalInfo.storyBody,
      stats:                portal.portalInfo.stats,
      // Website CMS section layout (null = default order; parsed by resolvePageSections)
      site_document:        portal.portalInfo.siteDocument ?? null,
      timezone:             portal.portalInfo.timezone ?? 'UTC',
      custom_domain:        portal.portalInfo.customDomain ?? null,
      // Menu-specific design
      menu_primary_color:        portal.portalInfo.menuPrimaryColor,
      menu_secondary_color:      portal.portalInfo.menuSecondaryColor,
      menu_accent_color:         portal.portalInfo.menuAccentColor,
      menu_text_primary_color:   portal.portalInfo.menuTextPrimaryColor,
      menu_text_secondary_color: portal.portalInfo.menuTextSecondaryColor,
      menu_accent_text_color:    portal.portalInfo.menuAccentTextColor,
      menu_border_color:         portal.portalInfo.menuBorderColor,
      menu_footer_bg_color:      portal.portalInfo.menuFooterBgColor,
      menu_section_bg_color:     portal.portalInfo.menuSectionBgColor,
      menu_font_family:          portal.portalInfo.menuFontFamily,
      menu_card_style:           portal.portalInfo.menuCardStyle,
      logo_url: portal.portalInfo.logoUrl,
      banner_url: portal.portalInfo.bannerUrl,
      announcement_text: portal.portalInfo.announcementText,
      announcement_enabled: portal.portalInfo.announcementEnabled ? 1 : 0,
      menubtn_status: portal.portalInfo.menubtnStatus ? 1 : 0,
      paybtn_status: portal.portalInfo.paybtnStatus ? 1 : 0,
      reviewbtn_status: portal.portalInfo.reviewbtnStatus ? 1 : 0,
    },
    business: {
      business_name: portal.portalInfo.businessName,
      industry_id: portal.portalInfo.industryId != null ? String(portal.portalInfo.industryId) : null,
      industry_name: portal.portalInfo.industryName ?? null,
      industry_group: portal.portalInfo.industryGroup ?? null,
      phone: portal.portalInfo.phone,
      address: portal.portalInfo.address,
      business_hours: portal.portalInfo.businessHours,
      availability: portal.portalInfo.availability,
      whatsapp_number: portal.portalInfo.whatsappNumber,
      location_url: portal.portalInfo.locationUrl,
      website_url: portal.portalInfo.websiteUrl,
      social_links: portal.portalInfo.socialLinks,
    },
    payment: {
      payment_type: portal.portalInfo.payment?.type,
      payment_link: portal.portalInfo.payment?.link,
      payment_qr_image: portal.portalInfo.payment?.qrImage,
    },
    review: {
      review_link: portal.portalInfo.reviewLink,
    },
    currency: portal.portalInfo.currency || null,
    gallery: (portal.gallery || []).map((g) => ({
      id: g.id,
      image_url: g.imageUrl,
    })),
    offers: (portal.offers || []).map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      offer_value: o.discount,
      image_url: o.imageUrl,
    })),
    menuItems: menuItems,
    faqs: (portal.faqs || []).map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    })),
    googleReviews: (portal.googleReviews || []).map((r) => ({
      id: r.id,
      authorName: r.authorName,
      authorPhotoUrl: r.authorPhotoUrl ?? null,
      rating: r.rating,
      text: r.text ?? null,
      relativePublishDescription: r.relativePublishDescription ?? null,
      publishTime: r.publishTime ?? null,
    })),
    awards: portal.awards ?? [],
    team: portal.team ?? [],
    events: portal.events ?? [],
  } as RawPublicSiteData;
});

const getLandingBySlug = cache(async (slug: string): Promise<MappedPublicUserDetails> => {
  const data = await getRawLandingWithMenuBySlug(slug);
  const mapped = mapPublicUserDetailsFromApi(data);
  if (!mapped.ok) {
    throw new Error(mapped.error);
  }
  return mapped.value;
});

const getMenuBySlug = cache(async (slug: string): Promise<PublicMenuPayload> => {
  const mapped = await getLandingBySlug(slug);
  const data = await getRawLandingWithMenuBySlug(slug);
  return {
    mapped,
    menuItems: data.menuItems,
    routeSlug: slug.trim().toLowerCase(),
  };
});

/**
 * The tenant landing for a slug (from the tenant-site route the proxy rewrites guest hosts to).
 * A slug that does not exist follows a stored redirect (renamed slug) or 404s.
 */
export async function resolveLandingBySlug(slug: string) {
  return { slug, data: await requireRawLandingBySlug(slug) };
}

/** Same as resolveLandingBySlug, for /menu. */
export async function resolveMenuBySlug(slug: string) {
  try {
    return await getMenuBySlug(slug);
  } catch (err) {
    if (!isMissingSiteError(err)) throw err;
    return await redirectOrNotFound(slug, PUBLIC_MENU_PATH);
  }
}

/**
 * Checks whether an unresolved slug/path has a stored redirect (see the
 * Redirects admin page — created automatically whenever a workspace changes
 * its public slug) before giving up with a 404, so a bookmarked/shared/
 * indexed old URL still lands somewhere. Uses Next's `redirect()` (a 307),
 * not a literal 301/302 — matching the exact stored status code would
 * require a middleware-level redirect instead of one thrown from a Server
 * Component, which is a reasonable follow-up but out of scope here.
 */
async function redirectOrNotFound(path: string, page: string = PUBLIC_LANDING_PATH): Promise<never> {
  let redirectTarget: string | null = null;

  try {
    const res = await fetchJson(`/public/redirects/${encodeURIComponent(path.trim().toLowerCase())}`, { revalidate: 0 });
    const { target, targetType } = res as { target?: string; targetType?: 'internal' | 'external' };
    if (target) {
      // An internal target is the restaurant's new slug: send the guest to that restaurant's own host.
      redirectTarget = targetType === 'external'
        ? target
        // Built from config, not the request host, so cached guest pages never read headers().
        : `${getTenantPublicUrl(target)}${page === PUBLIC_LANDING_PATH ? '' : page}`;
    }
  } catch {
    // No redirect for this path — fall through to notFound() below.
  }

  // `redirect()` throws a special Next.js control-flow error — it must NOT
  // be called inside the try/catch above, or its own throw would be
  // swallowed by the `catch` meant only for the fetch failing.
  if (redirectTarget) redirect(redirectTarget);
  notFound();
}

async function requireRawLandingBySlug(slug: string): Promise<RawPublicSiteData> {
  try {
    return await getRawLandingWithMenuBySlug(slug);
  } catch (err) {
    if (!isMissingSiteError(err)) throw err;
    return await redirectOrNotFound(slug);
  }
}

/**
 * Slugs for every publicly-visible tenant, for sitemap generation.
 * Uncached (unlike the `cache()`-wrapped fetchers above) since sitemap.ts
 * is invoked once per build/revalidation, not per-request.
 */
export async function fetchPublicSitemapSlugs(): Promise<PublicSitemapSlug[]> {
  try {
    const response = await fetchJson('/public/sitemap-slugs', { revalidate: 3600 });
    const slugs = (response as { slugs?: PublicSitemapSlug[] }).slugs;
    return Array.isArray(slugs) ? slugs : [];
  } catch {
    return [];
  }
}
