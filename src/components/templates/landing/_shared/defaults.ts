import type { RawPublicSiteData } from '@/types/components/templates/rawPublicSiteData.types';
import { toSafeExternalUrl } from '@/utils/url';
import { resolveTerms } from './industryTerms';

export type SignatureDish = { name: string; description: string; price?: string; image?: string };
export type Faq = { q: string; a: string };
export type HoursRow = { day: string; hours: string; startTime?: string; endTime?: string };
export type StatItem = { label: string; value: string };
export type GoogleReviewItem = {
  id: string | number;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string | null;
  relativePublishDescription: string | null;
  publishTime?: string | null;
};

export type RichContent = ReturnType<typeof getRichContent>;

/**
 * Builds the landing page's content model entirely from real tenant data.
 * Nothing here falls back to fake/placeholder copy — a section with no
 * underlying data resolves to an empty array / null and BaseTemplate hides it.
 */
export function getRichContent(data: RawPublicSiteData, slug: string) {
  const settings = (data.settings ?? {}) as Record<string, unknown>;
  const business = (data.business ?? {}) as Record<string, unknown>;

  const businessName = (business.business_name as string)?.trim() || 'The Atelier';
  const terms = resolveTerms(business.industry_group as string | null | undefined);
  const phone = (business.phone as string) ?? '';
  const address = (business.address as string) ?? '';
  const websiteUrlRaw = (business.website_url as string) ?? '';
  const websiteHref = websiteUrlRaw && /^https?:\/\//i.test(websiteUrlRaw)
    ? websiteUrlRaw
    : websiteUrlRaw ? `https://${websiteUrlRaw}` : '';
  const email = (business.email as string) ?? '';
  const whatsapp = (business.whatsapp_number as string) ?? '';
  const locationUrl = toSafeExternalUrl((business.location_url as string) ?? '');

  // `getRawLandingWithMenuBySlug` (the real public-portal data path) only ever
  // populates `social_links`; `social_media` is kept for other data sources
  // (e.g. the admin dashboard payload) that use that key instead.
  const rawSocial = business.social_media ?? business.social_links;
  const social = Array.isArray(rawSocial)
    ? (rawSocial as Array<{ url?: string; name?: string; platform?: string }>).filter(s => s?.url)
    : [];

  const announcement = settings.announcement_enabled
    && typeof settings.announcement_text === 'string'
    && (settings.announcement_text as string).trim()
    ? settings.announcement_text as string
    : null;

  const primary           = (settings.primary_color        as string) ?? '#171717';
  const secondary         = (settings.secondary_color      as string) ?? '#64748b';
  const accent            = (settings.accent_color         as string) ?? '#0f172a';
  const textPrimary       = (settings.text_primary_color   as string) ?? '';
  const textSecondary     = (settings.text_secondary_color as string) ?? '';
  const accentText        = (settings.accent_text_color    as string) ?? '';
  const borderColor       = (settings.border_color         as string) ?? '';
  const footerBg          = (settings.footer_bg_color      as string) ?? '';
  const sectionBg         = (settings.section_bg_color     as string) ?? '';
  const fontFamily        = (settings.font_family          as string) ?? '';
  const cardStyle         = (settings.card_style           as string) ?? '';
  const heroOverlay       = (settings.hero_overlay         as string) ?? '';
  const themeBadge        = (settings.theme_badge          as string) ?? '';
  const themeMarquee      = (settings.theme_marquee        as string) ?? '';
  const headingClass      = (settings.heading_class        as string) ?? '';
  const heroTagline       = (settings.hero_tagline         as string) ?? '';

  const menuBtn     = Boolean(settings.menubtn_status);
  const payBtn      = Boolean(settings.paybtn_status);
  const reviewBtn   = Boolean(settings.reviewbtn_status);
  const paymentLink = toSafeExternalUrl((data.payment as Record<string, unknown> | null)?.payment_link as string);
  const paymentType = ((data.payment as Record<string, unknown> | null)?.payment_type as string) ?? 'url';
  const paymentQrImage = ((data.payment as Record<string, unknown> | null)?.payment_qr_image as string) ?? '';
  const reviewLink  = toSafeExternalUrl((data.review  as Record<string, unknown> | null)?.review_link  as string);

  const currencySymbol = (data.currency?.symbol as string) || '$';

  const offers = (Array.isArray(data.offers) ? data.offers.filter(Boolean) : []).map((o: any) => {
    const rawVal = String(o.offer_value || '').trim();
    const hasOff = /off$/i.test(rawVal);
    const badgeText = o.badge_text || (rawVal ? (hasOff ? rawVal : `${rawVal} OFF`) : '');
    return { ...o, badge_text: badgeText };
  });
  const gallery = (Array.isArray(data.gallery) ? data.gallery : [])
    .filter((g) => typeof g.image_url === 'string' && g.image_url);

  const menuItems = Array.isArray(data.menuItems) ? data.menuItems : [];

  // Real signature items only — no fake fallback list when the tenant has too few items.
  const signatureDishes: SignatureDish[] = menuItems.slice(0, 6).map((m: any, i: number) => ({
    name:        (m?.name ?? m?.title ?? m?.item ?? `${terms.itemSingular} ${i + 1}`) as string,
    description: (m?.description ?? '') as string,
    price:       m?.price ? `${currencySymbol}${m.price}` : undefined,
    image:       (m?.image_url ?? m?.imageUrl ?? m?.images?.[0]?.url ?? undefined) as string | undefined,
  }));

  // Real "Popular" picks — favours items flagged `popular`, falls back to the first few
  // available items, and carries the actual item photo when one exists.
  const popularSource = menuItems.some((m: any) => m?.popular)
    ? menuItems.filter((m: any) => m?.popular)
    : menuItems;
  const popularItems = popularSource.slice(0, 8).map((m: any, i: number) => ({
    name:        (m?.name ?? m?.title ?? m?.item ?? `${terms.itemSingular} ${i + 1}`) as string,
    description: (m?.description ?? '') as string,
    price:       m?.price ? `${currencySymbol}${m.price}` : undefined,
    image:       (m?.image_url ?? m?.imageUrl ?? m?.images?.[0]?.url ?? null) as string | null,
    category:    (m?.category ?? '') as string,
  }));

  // Real opening hours from `businesses.availability` (array of {day, startTime, endTime}); hidden when empty.
  const availabilityRaw = business.availability;
  const hours: HoursRow[] = Array.isArray(availabilityRaw) && availabilityRaw.length > 0
    ? (availabilityRaw as Array<Record<string, unknown>>)
        .filter((row) => typeof row?.day === 'string' && row.day.trim())
        .map((row) => ({
          day: row.day as string,
          hours: row.startTime && row.endTime ? `${row.startTime} — ${row.endTime}` : 'Closed',
          // Raw 24h "HH:mm" values (as entered via the admin's <input type="time">),
          // kept alongside the display string for `<time dateTime>` markup.
          startTime: typeof row.startTime === 'string' ? row.startTime : undefined,
          endTime: typeof row.endTime === 'string' ? row.endTime : undefined,
        }))
    : [];

  const logoUrl   = (settings.logo_url   as string) || '';
  const bannerUrl = (settings.banner_url as string) || '';

  // "Our Story" — real copy only; null (section hidden) when the tenant hasn't written anything.
  const storyHeadline = (settings.story_headline as string) ?? '';
  const storyBody = (settings.story_body as string) ?? '';
  const story = storyHeadline.trim() || storyBody.trim()
    ? { headline: storyHeadline, body: storyBody }
    : null;

  // Stats bar — real, admin-entered figures only (array of up to 4 {label, value}).
  const stats: StatItem[] = Array.isArray(settings.stats)
    ? (settings.stats as StatItem[]).filter((s) => s?.label && s?.value)
    : [];

  // FAQs — already filtered to visible + ordered by the backend.
  const faqs: Faq[] = Array.isArray(data.faqs)
    ? data.faqs.map((f: any) => ({ q: f.question ?? '', a: f.answer ?? '' }))
    : [];

  // Google Reviews — already filtered to only the owner-featured reviews and
  // ordered most-recent-first by the backend.
  const googleReviews: GoogleReviewItem[] = Array.isArray(data.googleReviews)
    ? data.googleReviews.filter((r) => r && typeof r.authorName === 'string')
    : [];

  // Slogan/tagline — single source of truth is the admin-entered hero tagline; no theme fallback text.
  const slogan = heroTagline;

  return {
    slug,
    terms,
    businessName,
    phone,
    address,
    websiteUrlRaw,
    websiteHref,
    email,
    whatsapp,
    locationUrl,
    social,
    announcement,
    colors: { primary, secondary, accent, textPrimary, textSecondary, accentText, borderColor, footerBg, sectionBg },
    theme:  { fontFamily, cardStyle, heroOverlay, headingClass, badge: themeBadge, marqueeText: themeMarquee, heroTagline },
    cta: { menuBtn, payBtn, reviewBtn, paymentLink, paymentType, paymentQrImage, reviewLink },
    offers,
    gallery,
    menuItems,
    signatureDishes,
    popularItems,
    logoUrl,
    bannerUrl,
    currencySymbol,
    slogan,
    story,
    faqs,
    googleReviews,
    hours,
    stats,
  };
}
