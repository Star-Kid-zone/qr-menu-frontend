import type { DashboardData, AnalyticsDerivedMetrics } from "@/types";

export type { AnalyticsDerivedMetrics };

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
