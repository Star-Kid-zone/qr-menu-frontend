import type { DashboardData } from "@/services/analytics.service";
import type { MenuStats } from "@/services/menu.service";

export interface Insight {
  id: string;
  text: string;
  href?: string;
  cta?: string;
}

/** Percent change vs previous period; null when there is no baseline to compare against. */
export function pctChange(current: number, previous: number | undefined | null): number | null {
  if (previous == null) return null;
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatHour(hour: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}${hour < 12 ? "am" : "pm"}`;
}

/** Plain-language next steps worked out from data the app already has. At most 3. */
export function buildInsights(data: DashboardData | null, menuStats: MenuStats | null): Insight[] {
  const out: Insight[] = [];
  if (data) {
    const top = data.zeroResultSearches?.[0];
    if (top) {
      out.push({
        id: "zero-search",
        text: `${top.count} ${top.count === 1 ? "guest" : "guests"} searched "${top.query}" and found nothing.`,
        href: `/admin/addmenu?name=${encodeURIComponent(top.query)}`,
        cta: "Add this dish",
      });
    }
    const noPhoto = data.topMenuItems?.find((i) => !i.imageUrl);
    if (noPhoto) {
      out.push({
        id: "no-photo",
        text: `"${noPhoto.item}" is one of your most viewed dishes but has no photo.`,
        href: "/admin/listmenu",
        cta: "Add a photo",
      });
    }
    const payClicks = data.clickBreakdown?.payment_clicks ?? 0;
    if (data.summary.totalVisits >= 20 && payClicks === 0) {
      out.push({
        id: "no-pay",
        text: "Guests are visiting, but nobody has tapped Pay. Check your payment link works.",
        href: "/admin/settings?tab=payment",
        cta: "Check payment",
      });
    }
  }
  if (menuStats && menuStats.unavailable > 0) {
    out.push({
      id: "hidden",
      text: `${menuStats.unavailable} ${menuStats.unavailable === 1 ? "dish is" : "dishes are"} hidden from guests.`,
      href: "/admin/listmenu",
      cta: "Review dishes",
    });
  }
  return out.slice(0, 3);
}
