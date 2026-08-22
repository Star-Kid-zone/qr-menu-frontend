import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { APP_NAME, SERVER_API_BASE_URL } from '@/config/app.constants';
import { mapPublicUserDetailsFromApi } from '@/components/templates/core/mapPublicUserDetails';
import { MappedPublicUserDetails } from '@/types/components/templates/mapPublicUserDetails.types';
import type { RawPublicSiteData } from '@/types/components/templates/rawPublicSiteData.types';
import { normalizeMenuItems } from '@/utils/public-site.utils';
import type { PublicMenuPayload } from '@/types/public-site';
import { getTenantSlugFromHost } from '@/utils/tenantHost';

export const PUBLIC_REVALIDATE_SECONDS = 0;

async function fetchJson(path: string, init?: RequestInit & { revalidate?: number }) {
  const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
    ...init,
    next: { revalidate: init?.revalidate ?? PUBLIC_REVALIDATE_SECONDS },
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }

  return response.json() as Promise<{ data?: unknown }>;
}

export const getRawLandingWithMenuBySlug = cache(async (slug: string): Promise<RawPublicSiteData> => {
  const portalResponse = await fetchJson(`/public/portal/${encodeURIComponent(slug.trim())}`);
  if (!portalResponse) throw new Error('Empty response');
  const portal = portalResponse as any;

  // Flatten the grouped menu for the legacy templates
  const menuItems: any[] = [];
  if (portal.menu) {
    Object.keys(portal.menu).forEach(category => {
      portal.menu[category].forEach((item: any) => {
        menuItems.push({
          ...item,
          category,
          // map fields back to what templates expect if needed, or just pass as is
        });
      });
    });
  }

  return {
    user_id: Number(portal.portalInfo.userId),
    settings: {
      id: Number(portal.portalInfo.workspaceId),
      public_slug: slug,
      landing_theme: portal.portalInfo.landingTheme,
      landing_structure: portal.portalInfo.landingStructure,
      menu_structure: portal.portalInfo.menuStructure,
      menu_theme: portal.portalInfo.menuTheme,
      loading_screen_theme: portal.portalInfo.loadingScreenTheme,
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
      lottery_status: portal.portalInfo.lotteryStatus ? 1 : 0,
      logo_url: portal.portalInfo.logoUrl,
      banner_url: portal.portalInfo.bannerUrl,
      industry_feature_catalog: portal.portalInfo.industryFeatureCatalog,
      announcement_text: portal.portalInfo.announcementText,
      announcement_enabled: portal.portalInfo.announcementEnabled ? 1 : 0,
      menubtn_status: portal.portalInfo.menubtnStatus ? 1 : 0,
      paybtn_status: portal.portalInfo.paybtnStatus ? 1 : 0,
      reviewbtn_status: portal.portalInfo.reviewbtnStatus ? 1 : 0,
    },
    business: {
      business_name: portal.portalInfo.businessName,
      industry_id: portal.portalInfo.industryId != null ? Number(portal.portalInfo.industryId) : null,
      industry_name: portal.portalInfo.industryName ?? null,
      industry_group: portal.portalInfo.industryGroup ?? null,
      phone: portal.portalInfo.phone,
      address: portal.portalInfo.address,
      business_hours: portal.portalInfo.businessHours,
      availability: portal.portalInfo.availability,
      features: portal.portalInfo.features,
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
    gallery: (portal.gallery || []).map((g: any) => ({
      id: g.id,
      image_url: g.imageUrl,
    })),
    offers: (portal.offers || []).map((o: any) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      offer_value: o.discount,
      image_url: o.imageUrl,
    })),
    menuItems: menuItems,
    testimonials: (portal.testimonials || []).map((t: any) => ({
      id: t.id,
      authorName: t.authorName,
      authorRole: t.authorRole,
      quote: t.quote,
      rating: t.rating,
    })),
    faqs: (portal.faqs || []).map((f: any) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    })),
    lotteryRewards: (portal.lotteryRewards || []).map((r: any) => ({
      id: r.id,
      label: r.label,
      emoji: r.emoji,
      ratioWins: r.ratioWins,
      ratioPlays: r.ratioPlays,
    })),
  } as RawPublicSiteData;
});

export const getLandingBySlug = cache(async (slug: string): Promise<MappedPublicUserDetails> => {
  const data = await getRawLandingWithMenuBySlug(slug);
  const mapped = mapPublicUserDetailsFromApi(data);
  if (!mapped.ok) {
    throw new Error(mapped.error);
  }
  return mapped.value;
});

export const getLandingById = cache(async (id: string): Promise<MappedPublicUserDetails> => {
  const data = await getRawLandingWithMenuBySlug(id);
  const mapped = mapPublicUserDetailsFromApi(data);
  if (!mapped.ok) {
    throw new Error(mapped.error);
  }
  return mapped.value;
});

export const getMenuBySlug = cache(async (slug: string): Promise<PublicMenuPayload> => {
  const mapped = await getLandingBySlug(slug);
  const data = await getRawLandingWithMenuBySlug(slug);
  return {
    mapped,
    menuItems: data.menuItems,
    routeSlug: slug.trim().toLowerCase(),
  };
});

export const getMenuById = cache(async (id: string): Promise<PublicMenuPayload> => {
  const mapped = await getLandingById(id);
  const data = await getRawLandingWithMenuBySlug(id);
  return {
    mapped,
    menuItems: data.menuItems,
    routeSlug: mapped.publicSlug ?? '',
  };
});

export async function getTenantSlugFromRequestHost() {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') || headerStore.get('host') || '';
  return getTenantSlugFromHost(host);
}

export async function resolveLandingFromRequestHost() {
  const slug = await getTenantSlugFromRequestHost();
  if (!slug) return null;
  try {
    return { slug, data: await getRawLandingWithMenuBySlug(slug) };
  } catch {
    return null;
  }
}

export async function resolveMenuFromRequestHost() {
  const slug = await getTenantSlugFromRequestHost();
  if (!slug) return null;
  try {
    return await getMenuBySlug(slug);
  } catch {
    return null;
  }
}

export function buildPublicMetadata({
  title,
  description,
}: {
  title: string;
  description?: string | null;
}): Metadata {
  return {
    title: `${title} | ${APP_NAME}`,
    description: description || `${title} on ${APP_NAME}`,
  };
}

export async function requireRawLandingBySlug(slug: string): Promise<RawPublicSiteData> {
  try {
    return await getRawLandingWithMenuBySlug(slug);
  } catch {
    notFound();
  }
}

export async function requireLandingBySlug(slug: string) {
  try {
    return await getLandingBySlug(slug);
  } catch {
    notFound();
  }
}

export async function requireLandingById(id: string) {
  try {
    return await getLandingById(id);
  } catch {
    notFound();
  }
}

export async function requireMenuBySlug(slug: string) {
  try {
    return await getMenuBySlug(slug);
  } catch {
    notFound();
  }
}

export async function requireMenuById(id: string) {
  try {
    return await getMenuById(id);
  } catch {
    notFound();
  }
}

export interface PublicSitemapSlug {
  slug: string;
  updatedAt: string;
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
