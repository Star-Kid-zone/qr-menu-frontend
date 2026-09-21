import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics.hook';
import { NextLinkAdapter } from '@/components/next/NextLinkAdapter';
import { publicLandingPath, publicMenuPath } from '@/components/templates/core/paths';
import { mapGalleryWithResolvedUrls } from '@/components/templates/core/publicMedia';
import { getTenantSlugFromHost } from '@/utils/tenantHost';
import type { PublicLandingTemplateProps, PublicMenuTemplateProps } from '@/components/templates/core/types';
import type { MappedPublicUserDetails } from '@/types/components/templates/mapPublicUserDetails.types';
import type { PublicMenuPayload } from '@/types/public-site';
import type { Menu } from '@/types';

function useIsSubdomain(): boolean {
  const [isSubdomain, setIsSubdomain] = useState(false);
  useEffect(() => {
    setIsSubdomain(Boolean(getTenantSlugFromHost(window.location.hostname)));
  }, []);
  return isSubdomain;
}

function safeString(v: unknown, fallback = ''): string {
  return typeof v === 'string' && v.trim() ? v : fallback;
}

export function useLandingTemplateData(mapped: MappedPublicUserDetails, routeSlug: string | null): PublicLandingTemplateProps {
  const { track } = useAnalytics({ userId: mapped.userId });

  useEffect(() => {
    track('visit', 'landing_page', { page: 'landing', path: window.location.pathname });
  }, [track]);

  const isSubdomain = useIsSubdomain();
  const menuHref = useMemo(
    () => publicMenuPath(mapped.userId, routeSlug ?? mapped.publicSlug, isSubdomain),
    [mapped, routeSlug, isSubdomain],
  );

  const paymentLink = safeString(mapped.paymentLink, '');
  const reviewLink = safeString(mapped.reviewLink, '');
  const websiteUrl = safeString((mapped.business as any).website_url, '');
  const websiteHref =
    websiteUrl && /^https?:\/\//i.test(websiteUrl) ? websiteUrl : websiteUrl ? `https://${websiteUrl}` : '';

  const hasMenuHref = Boolean(menuHref && menuHref !== '#');
  const finalMenuBtn = mapped.menubtnStatus || hasMenuHref;

  return {
    businessName: safeString((mapped.business as any).business_name, 'Venue'),
    phone: safeString((mapped.business as any).phone, ''),
    address: safeString((mapped.business as any).address, ''),
    websiteUrl,
    websiteHref,
    social: mapped.social,
    announcement: mapped.announcementEnabled && mapped.announcementText.trim() ? mapped.announcementText : null,
    primary: mapped.primaryColor,
    secondary: mapped.secondaryColor,
    accent: mapped.accentColor,
    menuBtn: finalMenuBtn,
    payBtn: mapped.paybtnStatus,
    reviewBtn: mapped.reviewbtnStatus,
    paymentLink,
    reviewLink,
    offersOn: mapped.offersSectionEnabled,
    offers: mapped.offers,
    gallery: mapGalleryWithResolvedUrls(mapped.gallery),
    menuHref,
    onPay: () => {
      track('click', 'payment_button', { destination: 'payment' });
      if (paymentLink) window.open(paymentLink, '_blank', 'noopener,noreferrer');
    },
    onReview: () => {
      track('click', 'review_button', { destination: 'reviews' });
      if (reviewLink) window.open(reviewLink, '_blank', 'noopener,noreferrer');
    },
    track,
    LinkComponent: NextLinkAdapter,
    branches: mapped.branches,
    aboutHighlights: mapped.aboutHighlights,
    themeColour: mapped.themeColour,
    workspaceId: mapped.workspaceId,
  };
}

export function useMenuTemplateData(payload: PublicMenuPayload, routeSlug: string | null): PublicMenuTemplateProps {
  const { mapped, menuItems } = payload;
  const { track } = useAnalytics({ userId: mapped.userId });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [popularOnly, setPopularOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Menu | null>(null);

  useEffect(() => {
    track('visit', 'menu_page', { page: 'menu', path: window.location.pathname });
  }, [track]);

  const openItem = useCallback(
    (item: Menu) => {
      setSelectedItem(item);
      track('view', `item_${item.id}`, { itemName: item.item, category: item.category }, { menuItemId: item.id });
    },
    [track]
  );

  const closeItem = useCallback(() => setSelectedItem(null), []);

  // ── Derive unique filter options ──────────────────────────────────────────
  const allCategories = useMemo(() => {
    const seen = new Set<string>();
    for (const it of menuItems) {
      const c = it.category?.trim();
      if (c) seen.add(c);
    }
    return Array.from(seen);
  }, [menuItems]);

  const allTypes = useMemo(() => {
    const seen = new Set<string>();
    for (const it of menuItems) {
      const t = it.type?.trim();
      if (t) seen.add(t);
    }
    return Array.from(seen);
  }, [menuItems]);

  const hasPopular = useMemo(() => menuItems.some((it) => it.popular), [menuItems]);

  // ── Apply all active filters ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = menuItems;

    if (popularOnly) {
      list = list.filter((it) => it.popular);
    }
    if (activeCategory) {
      list = list.filter((it) => it.category === activeCategory);
    }
    if (activeType) {
      list = list.filter((it) => it.type === activeType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (it) =>
          it.item?.toLowerCase().includes(q) ||
          it.description?.toLowerCase().includes(q) ||
          it.category?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [menuItems, popularOnly, activeCategory, activeType, searchQuery]);

  // ── Track guest searches, debounced so we log intent, not keystrokes ──────
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) return;

    const timeout = setTimeout(() => {
      track('search', q, { resultsCount: filtered.length }, { searchQuery: q });
    }, 800);

    return () => clearTimeout(timeout);
  }, [searchQuery, filtered.length, track]);

  const grouped = useMemo(() => {
    const map = new Map<string, Menu[]>();
    for (const item of filtered) {
      const cat = item.category || 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const isSubdomain = useIsSubdomain();
  const homeHref = useMemo(
    () => publicLandingPath(mapped.userId, routeSlug ?? mapped.publicSlug, isSubdomain),
    [mapped, routeSlug, isSubdomain],
  );
  const paymentLink = mapped.paymentLink || '';
  const settings = mapped.settings;

  return {
    businessName: ((mapped.business as any).business_name as string) || 'Venue',
    phone: ((mapped.business as any).phone as string) || '',
    address: ((mapped.business as any).address as string) || '',
    announcement: mapped.announcementEnabled && mapped.announcementText.trim() ? mapped.announcementText : null,
    social: mapped.social,
    socialLinks: mapped.social,
    // Use menu-specific colors, falling back to shared workspace colors
    primary:   (settings.menu_primary_color   as string) || mapped.primaryColor,
    secondary: (settings.menu_secondary_color as string) || mapped.secondaryColor,
    accent:    (settings.menu_accent_color    as string) || mapped.accentColor,
    grouped,
    currencySymbol: mapped.currency?.symbol || '$',
    searchQuery,
    setSearchQuery,
    allCategories,
    allTypes,
    hasPopular,
    activeCategory,
    setActiveCategory,
    activeType,
    setActiveType,
    popularOnly,
    setPopularOnly,
    selectedItem,
    openItem,
    closeItem,
    landingHref: homeHref,
    payBtn: mapped.paybtnStatus,
    paymentLink,
    onPay: () => {
      track('click', 'payment_button', { destination: 'payment' });
      if (paymentLink) window.open(paymentLink, '_blank', 'noopener,noreferrer');
    },
    track,
    LinkComponent: NextLinkAdapter,
    themeColour: mapped.themeColour,
    gallery: mapGalleryWithResolvedUrls(mapped.gallery),
    workspaceId: mapped.workspaceId,
    offersOn: mapped.offersSectionEnabled,
    offers: mapped.offers,
    // Menu-specific design settings (fall back to shared settings if menu-specific not set)
    fontFamily:    (settings.menu_font_family          as string) || (settings.font_family          as string) || '',
    cardStyle:     (settings.menu_card_style           as string) || (settings.card_style           as string) || '',
    heroOverlay:   '',
    textPrimary:   (settings.menu_text_primary_color   as string) || (settings.text_primary_color   as string) || '',
    textSecondary: (settings.menu_text_secondary_color as string) || (settings.text_secondary_color as string) || '',
    accentText:    (settings.menu_accent_text_color    as string) || (settings.accent_text_color    as string) || '',
    borderColor:   (settings.menu_border_color         as string) || (settings.border_color         as string) || '',
    footerBg:      (settings.menu_footer_bg_color      as string) || (settings.footer_bg_color      as string) || '',
    sectionBg:     (settings.menu_section_bg_color     as string) || (settings.section_bg_color     as string) || '',
  };
}
