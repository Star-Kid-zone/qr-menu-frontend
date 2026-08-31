'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import { analyticsService, type DashboardData, type VisitorsPage } from "@/services/analytics.service";
import { menuService, type MenuStats } from "@/services/menu.service";
import {
  PiChartLineUpBold,
  PiCursorClickBold,
  PiForkKnifeBold,
  PiMagnifyingGlassBold,
  PiQrCodeBold,
  PiSmileySadBold,
  PiTrendUpBold,
  PiUsersBold,
  PiWarningCircleBold,
  PiStarFill,
  PiDownloadSimpleBold,
  PiDeviceMobileBold,
  PiDesktopBold,
  PiDeviceTabletBold,
  PiCalendarBold,
} from "react-icons/pi";
import { downloadCsv } from "@/utils/downloadCsv";
import { deriveAnalyticsMetrics } from "@/utils/analyticsMetrics";
import { getApiErrorMessage } from "@/utils/errors";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";

type RangeKey = '7d' | '30d' | 'all';

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>('30d');

  const [visitorsPage, setVisitorsPage] = useState<VisitorsPage | null>(null);
  const [visitorsLoading, setVisitorsLoading] = useState(true);
  const [visitorsPageNum, setVisitorsPageNum] = useState(1);

  const [menuStats, setMenuStats] = useState<MenuStats | null>(null);
  const [menuStatsLoading, setMenuStatsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await analyticsService.getDashboard(range);
        setData(res);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load analytics'));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [range]);

  useEffect(() => {
    async function loadMenuStats() {
      try {
        setMenuStatsLoading(true);
        const res = await menuService.getStats();
        setMenuStats(res.data);
      } catch (err) {
        console.error('Failed to load menu stats:', err);
      } finally {
        setMenuStatsLoading(false);
      }
    }
    loadMenuStats();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadVisitors() {
      try {
        setVisitorsLoading(true);
        const res = await analyticsService.getVisitors(visitorsPageNum, 10);
        if (!cancelled) setVisitorsPage(res);
      } catch (err) {
        console.error('Failed to load visitors:', err);
      } finally {
        if (!cancelled) setVisitorsLoading(false);
      }
    }
    loadVisitors();
    return () => { cancelled = true; };
  }, [visitorsPageNum]);

  const formatDevice = useCallback((userAgent: string | null) => {
    if (!userAgent) return { label: 'Unknown', icon: <PiDesktopBold size={14} /> };
    const ua = userAgent.toLowerCase();
    if (/ipad|tablet/.test(ua)) return { label: 'Tablet', icon: <PiDeviceTabletBold size={14} /> };
    if (/mobi|iphone|android/.test(ua)) return { label: 'Mobile', icon: <PiDeviceMobileBold size={14} /> };
    return { label: 'Desktop', icon: <PiDesktopBold size={14} /> };
  }, []);

  const derived = useMemo(() => deriveAnalyticsMetrics(data), [data]);

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <PiWarningCircleBold size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Failed to load analytics</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  const rangeLabels: Record<RangeKey, string> = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    'all': 'All Time',
  };

  const statCards = [
    {
      label: "Total Visits",
      value: data?.summary.totalVisits.toLocaleString() || "0",
      subtext: data?.today.visits ? `+${data.today.visits} visits today` : `Avg ${derived.avgDailyVisits}/day`,
      icon: <PiUsersBold size={18} />,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Unique Visitors",
      value: data?.summary.uniqueVisitors.toLocaleString() || "0",
      subtext: data?.today.newVisitors ? `+${data.today.newVisitors} new today` : "Distinct devices",
      icon: <PiQrCodeBold size={18} />,
      color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50",
    },
    {
      label: "Total Clicks",
      value: data?.summary.totalClicks.toLocaleString() || "0",
      subtext: `${derived.conversionRate}% conversion rate`,
      icon: <PiCursorClickBold size={18} />,
      color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/50",
    },
    {
      label: "Menu Searches",
      value: data?.summary.totalSearches.toLocaleString() || "0",
      subtext: data?.today.searches ? `+${data.today.searches} today` : "Guest dish searches",
      icon: <PiMagnifyingGlassBold size={18} />,
      color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50",
    },
  ];

  const clickBreakdownEntries = Object.entries(data?.clickBreakdown || {}).sort(([, a], [, b]) => b - a);
  const totalClickSum = derived.totalClickSum || 1;

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto pr-1 pb-8">

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Analytics & Insights</h1>
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            {rangeLabels[range]} · Traffic, dish popularity, and actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range switcher */}
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5 shadow-xs">
            {(["7d", "30d", "all"] as RangeKey[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={cn(
                  "cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  range === r
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                {r === "7d" ? "7D" : r === "30d" ? "30D" : "All"}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 text-xs sm:h-9"
            leftIcon={<PiDownloadSimpleBold size={13} />}
            onClick={() =>
              downloadCsv('/analytics/visitors/export.csv', 'visitors-analytics.csv').catch(() =>
                toast.error('Failed to export CSV'),
              )
            }
          >
            Export
          </Button>
        </div>
      </div>

      {/* ─── Primary 4 KPI Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground sm:text-xs">{stat.label}</span>
              <div className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-2">
              {loading ? (
                <Skeleton className="h-6 w-16 sm:h-7 sm:w-20" />
              ) : (
                <p className="text-xl sm:text-2xl font-bold tabular-figures text-foreground">{stat.value}</p>
              )}
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Main Grid: Visit History (2 cols) + Engagement/Top Items (1 col) ─── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Left Column (2/3) */}
        <div className="flex flex-col gap-5 lg:col-span-2">

          {/* Visits Over Time Chart */}
          <Card className="rounded-xl border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-foreground">Traffic Over Time</CardTitle>
                  <p className="text-xs text-muted-foreground">{rangeLabels[range]} · Daily guest visits</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Peak: {derived.peakCount} visits ({derived.peakDay})
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col p-5">
              {loading ? (
                <div className="flex h-48 items-end gap-2">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 flex-1 rounded-t-md" />
                  ))}
                </div>
              ) : data?.visitHistory && data.visitHistory.length > 0 ? (
                <div>
                  <div className="flex h-48 items-end gap-1.5 pt-6">
                    {(() => {
                      const maxCount = Math.max(...data.visitHistory.map((d) => d.count), 1);
                      return data.visitHistory.map((val, i) => {
                        const heightPct = (val.count / maxCount) * 100;
                        return (
                          <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                            <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[10px] font-bold text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                              {val.count} visits · {val.date}
                            </span>
                            <div
                              className="w-full rounded-t bg-primary/75 transition-all duration-150 hover:bg-primary"
                              style={{ height: `${Math.max(heightPct, 4)}%` }}
                            />
                            <span className="mt-2 text-[9px] font-medium text-muted-foreground">
                              {new Date(val.date).toLocaleDateString(undefined, { weekday: 'narrow' })}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="mt-3 flex justify-between border-t border-border pt-2.5 text-[10px] font-medium text-muted-foreground">
                    <span>{data.visitHistory[0]?.date}</span>
                    <span>Average: <strong className="text-foreground">{derived.avgDailyVisits}</strong> visits/day</span>
                    <span>{data.visitHistory[data.visitHistory.length - 1]?.date}</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
                  No visit history for this period.
                </div>
              )}
            </CardContent>
          </Card>

          {/* New vs Returning Visitors Trend */}
          <Card className="rounded-xl border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-foreground">New vs. Returning Visitors</CardTitle>
                  <p className="text-xs text-muted-foreground">Customer retention and acquisition breakdown</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-primary">
                    <span className="size-2 rounded-full bg-primary" /> New
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary/30" /> Returning
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {loading ? (
                <div className="flex h-40 items-end gap-2">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 flex-1 rounded-t-md" />
                  ))}
                </div>
              ) : data?.visitorTrend && data.visitorTrend.length > 0 ? (
                <div>
                  <div className="flex h-40 items-end gap-1.5 pt-6">
                    {(() => {
                      const maxTotal = Math.max(
                        ...data.visitorTrend.map((d) => d.newVisitors + d.returningVisitors),
                        1,
                      );
                      return data.visitorTrend.map((day, i) => {
                        const dayTotal = day.newVisitors + day.returningVisitors;
                        const heightPct = (dayTotal / maxTotal) * 100;
                        const newPct = dayTotal > 0 ? (day.newVisitors / dayTotal) * 100 : 0;
                        return (
                          <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                            <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[10px] font-bold text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                              {day.newVisitors} new · {day.returningVisitors} returning
                            </span>
                            <div
                              className="flex w-full flex-col-reverse overflow-hidden rounded-t"
                              style={{ height: `${Math.max(heightPct, 4)}%` }}
                            >
                              <div className="w-full bg-primary/30" style={{ height: `${100 - newPct}%` }} />
                              <div className="w-full bg-primary" style={{ height: `${newPct}%` }} />
                            </div>
                            <span className="mt-2 text-[9px] font-medium text-muted-foreground">
                              {new Date(day.date).toLocaleDateString(undefined, { weekday: 'narrow' })}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
                  No visitor trend data recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="flex flex-col gap-5">

          {/* Click Distribution */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Interactions</p>
                <p className="text-sm font-semibold text-foreground">Action Breakdown</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {data?.summary.totalClicks || 0} clicks
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : clickBreakdownEntries.length > 0 ? (
              <div className="space-y-3">
                {clickBreakdownEntries.map(([target, count]) => {
                  const pct = Math.round((count / totalClickSum) * 100);
                  return (
                    <div key={target} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium capitalize text-foreground">{target.replaceAll('_', ' ')}</span>
                        <span className="tabular-figures text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-4 text-center text-xs text-muted-foreground">No customer actions recorded yet.</p>
            )}
          </div>

          {/* Top Menu Items */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <PiStarFill size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Popularity</p>
                <p className="text-sm font-semibold text-foreground">Top Viewed Dishes</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : data?.topMenuItems && data.topMenuItems.length > 0 ? (
              <ul className="divide-y divide-border">
                {data.topMenuItems.slice(0, 5).map((item, i) => (
                  <li key={item.menuItemId} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <p className="truncate text-xs font-semibold text-foreground">{item.item}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                      {item.count} views
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-xs text-muted-foreground">No menu item views recorded yet.</p>
            )}
          </div>

          {/* Key Insights summary */}
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quick Summary</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Most Popular Item</span>
                <span className="font-bold text-foreground">{data?.summary.popularItem || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Average Daily Traffic</span>
                <span className="font-bold text-foreground">{derived.avgDailyVisits} visitors</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-bold text-foreground">{derived.conversionRate}%</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Secondary Section: Search Intelligence & Menu Health ─────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Top Searches + Zero Results */}
        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <PiMagnifyingGlassBold size={16} className="text-primary" />
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">Search Intelligence</CardTitle>
                <p className="text-xs text-muted-foreground">What guests are searching for</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Top queries */}
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Top Queries</p>
                  {data?.topSearches && data.topSearches.length > 0 ? (
                    <ul className="space-y-1.5">
                      {data.topSearches.slice(0, 5).map((s, i) => (
                        <li key={`${s.query}-${i}`} className="flex items-center justify-between rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs">
                          <span className="truncate font-medium text-foreground">{s.query}</span>
                          <span className="text-muted-foreground">{s.count}×</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">No searches yet.</p>
                  )}
                </div>

                {/* Zero results */}
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">No Results Found</p>
                  {data?.zeroResultSearches && data.zeroResultSearches.length > 0 ? (
                    <ul className="space-y-1.5">
                      {data.zeroResultSearches.slice(0, 5).map((s, i) => (
                        <li key={`${s.query}-${i}`} className="flex items-center justify-between rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                          <span className="truncate font-medium">{s.query}</span>
                          <span>{s.count}×</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">All customer searches matched dishes!</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Catalog Breakdown */}
        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <PiForkKnifeBold size={16} className="text-primary" />
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">Menu Catalog Distribution</CardTitle>
                <p className="text-xs text-muted-foreground">Active inventory by dish category</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            {menuStatsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : menuStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                    <p className="text-lg font-bold text-foreground">{menuStats.total}</p>
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground">Total</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-2.5 text-center dark:bg-emerald-950/40">
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{menuStats.available}</p>
                    <p className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-500">Available</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-2.5 text-center dark:bg-amber-950/40">
                    <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{menuStats.popular}</p>
                    <p className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-500">Popular</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {menuStats.byCategory.slice(0, 4).map((c) => {
                    const pct = menuStats.total > 0 ? Math.round((c.count / menuStats.total) * 100) : 0;
                    return (
                      <div key={c.category} className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{c.category}</span>
                          <span className="text-muted-foreground">{c.count} items ({pct}%)</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No menu items configured.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Visitors Activity Log ─────────────────────────────────────── */}
      <Card className="rounded-xl border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">Recent Guest Sessions</CardTitle>
              <p className="text-xs text-muted-foreground">Detailed log of individual customer visits</p>
            </div>
            {visitorsPage && (
              <span className="text-xs font-semibold text-muted-foreground">
                {visitorsPage.total} total visitors recorded
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {visitorsLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : visitorsPage && visitorsPage.visitors.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-3">Visitor ID</th>
                      <th className="px-5 py-3">Device</th>
                      <th className="px-5 py-3">First Seen</th>
                      <th className="px-5 py-3">Last Active</th>
                      <th className="px-5 py-3 text-right">Visits</th>
                      <th className="px-5 py-3 text-right">Clicks</th>
                      <th className="px-5 py-3 text-right">Searches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visitorsPage.visitors.map((v) => {
                      const device = formatDevice(v.userAgent);
                      return (
                        <tr key={v.visitorId} className="transition hover:bg-muted/30">
                          <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{v.visitorId.slice(0, 8)}…</td>
                          <td className="px-5 py-3">
                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                              {device.icon}
                              {device.label}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{new Date(v.firstSeen).toLocaleDateString()}</td>
                          <td className="px-5 py-3 text-muted-foreground">{new Date(v.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="px-5 py-3 text-right font-bold tabular-figures text-foreground">{v.visits}</td>
                          <td className="px-5 py-3 text-right font-bold tabular-figures text-foreground">{v.clicks}</td>
                          <td className="px-5 py-3 text-right font-bold tabular-figures text-foreground">{v.searches}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border p-3">
                <Pagination
                  page={visitorsPage.page}
                  pageCount={visitorsPage.totalPages}
                  totalItems={visitorsPage.total}
                  pageSize={visitorsPage.pageSize}
                  onPageChange={(p) => setVisitorsPageNum(p)}
                />
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">No visitors recorded yet.</div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
