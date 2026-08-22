import type { DashboardData } from "@/services/analytics.service";

export interface AnalyticsDerivedMetrics {
  /** Total clicks / total visits, as a percentage string with one decimal place (e.g. "12.3"). */
  conversionRate: string;
  /** Average visits per day across `visitHistory`, rounded to the nearest integer. */
  avgDailyVisits: number;
  /** Human-readable label (e.g. "Jul 21") for the day with the highest visit count, or "—" if unavailable. */
  peakDay: string;
  /** Visit count on `peakDay`. */
  peakCount: number;
  /** Sum of all values in `clickBreakdown`. */
  totalClickSum: number;
}

/**
 * Computes shared derived analytics metrics (conversion rate, average daily
 * visits, peak day/count, total click sum) from a `DashboardData` payload.
 *
 * Centralized here so admin/home and admin/analytics don't each maintain
 * their own copy of this calculation.
 */
export function deriveAnalyticsMetrics(
  data: DashboardData | null | undefined,
): AnalyticsDerivedMetrics {
  if (!data) {
    return { conversionRate: "0.0", avgDailyVisits: 0, peakDay: "—", peakCount: 0, totalClickSum: 0 };
  }

  const conversionRate = data.summary.totalVisits > 0
    ? ((data.summary.totalClicks / data.summary.totalVisits) * 100).toFixed(1)
    : "0.0";

  const totalHistoryVisits = data.visitHistory.reduce((sum, d) => sum + d.count, 0);
  const avgDailyVisits = data.visitHistory.length > 0
    ? Math.round(totalHistoryVisits / data.visitHistory.length)
    : 0;

  let peakDay = "—";
  let peakCount = 0;
  data.visitHistory.forEach((d) => {
    if (d.count > peakCount) {
      peakCount = d.count;
      peakDay = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  });

  const totalClickSum = Object.values(data.clickBreakdown).reduce((s, v) => s + v, 0);

  return { conversionRate, avgDailyVisits, peakDay, peakCount, totalClickSum };
}
