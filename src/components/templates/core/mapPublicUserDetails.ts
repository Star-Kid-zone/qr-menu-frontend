/**
 * Maps `GET /api/settings/user/:id` and `GET /api/settings/user/slug/:slug` payloads
 * (same shape as workspace dashboard `include=dashboard` settings slice — see {@link WorkspaceDashboardData}).
 */

import type {
  GalleryItem,
  OfferRow,
  PublicBusinessBranch,
  PublicFeatureCatalogEntry,
  PublicFeatureGroup,
} from './types';
import type { SocialLink } from '@/types';
import { MappedPublicUserDetails } from "@/types/components/templates/mapPublicUserDetails.types";
import { toSafeExternalUrl } from '@/utils/url';

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return null;
}

function safeString(v: unknown, fallback = ''): string {
  return typeof v === 'string' && v.trim() ? v : fallback;
}

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() && /^\d+$/.test(v.trim())) return Number(v.trim());
  return null;
}

/**
 * API shape: `industry_feature_catalog` is keyed by industry id (`"2"`, `"3"`, …).
 * Each value is an object: group name → array of `{ id, name }` (or legacy strings).
 */
function extractCatalogForIndustry(
  cat: Record<string, unknown> | null,
  industryId: number | null
): { groups: PublicFeatureGroup[]; flat: PublicFeatureCatalogEntry[] } {
  const groups: PublicFeatureGroup[] = [];
  const flat: PublicFeatureCatalogEntry[] = [];
  if (!cat || industryId == null || industryId <= 0) {
    return { groups, flat };
  }
  const bucket = cat[String(industryId)];
  if (!bucket || typeof bucket !== 'object' || Array.isArray(bucket)) {
    return { groups, flat };
  }
  for (const [groupName, val] of Object.entries(bucket as Record<string, unknown>)) {
    if (!groupName || groupName.startsWith('_')) continue;
    const items: string[] = [];
    if (!Array.isArray(val)) continue;
    let idx = 0;
    for (const row of val) {
      let label = '';
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        const o = row as Record<string, unknown>;
        label = safeString(o.name ?? o.title, '');
      } else if (typeof row === 'string' && row.trim()) {
        label = row.trim();
      }
      if (!label) continue;
      items.push(label);
      idx += 1;
      flat.push({ key: `${groupName}:${label}:${idx}`, label });
    }
    if (items.length) groups.push({ group: groupName, items });
  }
  return { groups, flat };
}

function parseCurrency(settings: Record<string, unknown>): MappedPublicUserDetails['currency'] {
  const c = asRecord(settings.currency);
  if (!c) return null;
  const symbol = safeString(c.symbol, '');
  if (!symbol) return null;
  return {
    id: num(c.id) ?? undefined,
    symbol,
    code: safeString(c.code, '') || undefined,
    name: safeString(c.name, '') || undefined,
  };
}

function parseBranches(business: Record<string, unknown> | null): PublicBusinessBranch[] {
  if (!business) return [];
  const name = safeString(business.business_name, '');
  if (!name) return [];
  return [
    {
      id: num(business.id) ?? undefined,
      business_name: name,
      phone: safeString(business.phone, '') || undefined,
      address: safeString(business.address, '') || undefined,
      active: typeof business.active === 'boolean' ? business.active : undefined,
    },
  ];
}

/**
 * Flatten industry `about_features` sections into display lines (strings).
 * Matches {@link EditBusinessPanel} / workspace: `items` can be `string[]` or richer objects.
 */
function parseAboutHighlights(aboutRaw: unknown): string[] {
  const root = asRecord(aboutRaw);
  if (!root) return [];
  const lines: string[] = [];
  for (const section of Object.values(root)) {
    const s = asRecord(section);
    if (!s || s.enabled === false) continue;
    const items = s.items;
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      if (typeof it === 'string' && it.trim()) {
        lines.push(it.trim());
      } else if (it && typeof it === 'object' && !Array.isArray(it)) {
        const o = it as Record<string, unknown>;
        const name = safeString(o.name ?? o.title, '');
        const desc = safeString(o.description ?? o.detail, '');
        if (name) lines.push(desc ? `${name} — ${desc}` : name);
      }
    }
  }
  return lines;
}

/**
 * Maps API `data` object (not the full axios envelope) from public user-details endpoints.
 */
export function mapPublicUserDetailsFromApi(data: unknown): { ok: true; value: MappedPublicUserDetails } | { ok: false; error: string } {
  const root = asRecord(data);
  if (!root) {
    return { ok: false, error: 'Invalid response.' };
  }

  const userId = num(root.user_id);
  if (userId == null || userId <= 0) {
    return { ok: false, error: 'Missing tenant user.' };
  }

  const settings = asRecord(root.settings) ?? {};
  const business = asRecord(root.business);

  const primaryColor = safeString(settings.primary_color, '#171717');
  const secondaryColor = safeString(settings.secondary_color, '#64748b');
  const accentColor = safeString(settings.accent_color, '#0f172a');

  const lt = settings.landing_theme;
  const landingThemeRaw = lt != null && String(lt).trim() !== '' ? String(lt) : '1';

  const mt = settings.menu_theme;
  const menuThemeRaw = mt != null && String(mt).trim() !== '' ? String(mt) : '1';

  const payment = asRecord(root.payment);
  const review = asRecord(root.review);

  const rawOffers = Array.isArray(root.offers) ? root.offers : [];
  const offers: OfferRow[] = rawOffers.map((o) => {
    const r = asRecord(o);
    const badge = r?.badge_text;
    const ov = r?.offer_value;
    const ot = r?.offer_type;
    return {
      id: num(r?.id) ?? undefined,
      title: safeString(r?.title, 'Offer'),
      description: typeof r?.description === 'string' ? r.description : null,
      badge_text: typeof badge === 'string' && badge.trim() ? badge.trim() : null,
      offer_value: ov != null && String(ov).trim() ? String(ov).trim() : null,
      offer_type: typeof ot === 'string' && ot.trim() ? ot.trim() : null,
    };
  });

  const rawGallery = Array.isArray(root.gallery) ? root.gallery : [];
  const gallery = rawGallery as GalleryItem[];

  const rawWsGallery = Array.isArray(root.workspace_gallery) ? root.workspace_gallery : [];
  const workspaceGallery = rawWsGallery as GalleryItem[];

  const rawWsOffers = Array.isArray(root.workspace_offers) ? root.workspace_offers : [];

  const branches = parseBranches(business);

  const bizForSocial = business ?? {};

  const sm = bizForSocial.social_media ?? bizForSocial.social_links;
  const social: SocialLink[] = Array.isArray(sm) ? (sm as SocialLink[]) : [];

  const themeColour = typeof settings.theme_colour === 'string' ? settings.theme_colour : null;
  const publicSlug =
    typeof settings.public_slug === 'string' && settings.public_slug.trim()
      ? settings.public_slug.trim().toLowerCase()
      : null;

  const aboutRaw = bizForSocial.about_features;
  const aboutHighlights = parseAboutHighlights(aboutRaw);

  const cat = settings.industry_feature_catalog;
  const industryFeatureCatalog =
    cat && typeof cat === 'object' && !Array.isArray(cat) ? (cat as Record<string, unknown>) : null;
  const industryId = business ? num(business.industry_id) : null;
  const { groups: featureCatalogGroups, flat: featureCatalogEntries } = extractCatalogForIndustry(
    industryFeatureCatalog,
    industryId
  );

  const wid = num(settings.id);

  const value: MappedPublicUserDetails = {
    userId,
    workspaceId: wid != null && wid > 0 ? wid : null,
    settings,
    themeColour,
    primaryColor,
    secondaryColor,
    accentColor,
    publicSlug,
    landingThemeRaw,
    menuThemeRaw,
    menubtnStatus: Boolean(settings.menubtn_status),
    paybtnStatus: Boolean(settings.paybtn_status),
    reviewbtnStatus: Boolean(settings.reviewbtn_status),
    specialOfferStatus: Boolean(settings.special_offerstatus),
    lotteryStatus: Boolean(settings.lottery_status),
    announcementEnabled: Boolean(settings.announcement_enabled),
    announcementText: typeof settings.announcement_text === 'string' ? settings.announcement_text : '',
    currency: parseCurrency(settings),
    business: bizForSocial,
    branches,
    social,
    paymentLink: toSafeExternalUrl(safeString(payment?.payment_link, '')),
    reviewLink: toSafeExternalUrl(safeString(review?.review_link, '')),
    offers,
    /** Show whenever there are date-valid active offers from the API (guest-friendly). */
    offersSectionEnabled: offers.length > 0,
    gallery,
    workspaceGallery,
    workspaceOffersCount: rawWsOffers.length,
    aboutHighlights,
    industryFeatureCatalog,
    featureCatalogEntries,
    featureCatalogGroups,
  };

  return { ok: true, value };
}
