'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import { analyticsService, type DashboardData, type VisitorsPage } from "@/services/analytics.service";
import { menuService, type MenuStats } from "@/services/menu.service";
import {
  PiCalendarCheckBold,
  PiChartLineUpBold,
  PiCursorClickBold,
  PiForkKnifeBold,
  PiMagnifyingGlassBold,
  PiQrCodeBold,
  PiSmileySadBold,
  PiTrendUpBold,
  PiUsersBold,
  PiWarningCircleBold,
  PiStarBold,
  PiDownloadSimpleBold,
} from "react-icons/pi";
import { downloadCsv } from "@/utils/downloadCsv";
import { deriveAnalyticsMetrics } from "@/utils/analyticsMetrics";
import { getApiErrorMessage } from "@/utils/errors";
import { PageHeader } from "@/components/ui/PageHeader";

type RangeKey = '7d' | '30d' | 'all';

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>('7d');

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
    return () => {
      cancelled = true;
    };
  }, [visitorsPageNum]);

  const formatDeviceLabel = useCallback((userAgent: string | null) => {
    if (!userAgent) return 'Unknown device';
    const ua = userAgent.toLowerCase();
    if (/ipad|tablet/.test(ua)) return 'Tablet';
    if (/mobi|iphone|android/.test(ua)) return 'Mobile';
    return 'Desktop';
  }, []);

  // Derive all extra metrics on the frontend from the existing API data.
  // Shared with admin/home via deriveAnalyticsMetrics().
  const derived = useMemo(() => deriveAnalyticsMetrics(data), [data]);

  if (error) {
    return (
      <div className="animate-fade-in-up flex h-full flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-10 text-center">
        <PiWarningCircleBold className="size-12 text-destructive" />
        <h3 className="text-h2 text-foreground">Failed to load analytics</h3>
        <p className="max-w-sm text-body text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  const rangeLabels: Record<RangeKey, string> = { '7d': 'Last 7 Days', '30d': 'Last 30 Days', 'all': 'All Time' };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto pb-6">
      {/* Header */}
      <PageHeader
        className="shrink-0"
        title="Analytics"
        description="Deep dive into your traffic and engagement."
        actions={
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/50">
            {(["7d", "30d", "all"] as RangeKey[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-base ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 ${
                  range === r
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {/* Today */}
      <div className="animate-fade-in-up shrink-0 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <PiCalendarCheckBold size={16} />
          Today
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Visitors Today", value: data?.today.visitors },
            { label: "New Visitors", value: data?.today.newVisitors },
            { label: "Returning", value: data?.today.returningVisitors },
            { label: "Events Today", value: data?.today.events },
            { label: "Visits Today", value: data?.today.visits },
            { label: "Searches Today", value: data?.today.searches },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
              {loading ? (
                <Skeleton className="mt-1.5 h-7 w-16" />
              ) : (
                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{(s.value ?? 0).toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Visits", value: data?.summary.totalVisits.toLocaleString() || "0", icon: <PiUsersBold size={20} /> },
          { label: "Total Clicks", value: data?.summary.totalClicks.toLocaleString() || "0", icon: <PiCursorClickBold size={20} /> },
          { label: "Total Searches", value: data?.summary.totalSearches.toLocaleString() || "0", icon: <PiMagnifyingGlassBold size={20} /> },
          { label: "Unique Visitors", value: data?.summary.uniqueVisitors.toLocaleString() || "0", icon: <PiQrCodeBold size={20} /> },
        ].map((s, i) => (
          <Card
            key={s.label}
            className="animate-fade-in-up border-border/50 bg-card shadow-neu-sm transition-shadow duration-base ease-out hover:shadow-neu"
            style={{ animationDelay: `${80 + i * 40}ms` }}
          >
            <CardContent className="flex flex-col gap-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {s.icon}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                {loading ? (
                  <Skeleton className="mt-1.5 h-8 w-20" />
                ) : (
                  <p className="mt-1 text-3xl font-bold tracking-tight text-foreground tabular-figures">{s.value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Sidebar */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Visits Over Time */}
        <Card className="flex flex-col xl:col-span-2 border-border/50">
          <CardHeader className="shrink-0 border-b border-border/40 bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Visits Over Time</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{rangeLabels[range]}</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <PiChartLineUpBold size={14} />
                Live
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[300px] flex-1 flex-col p-6">
            {loading ? (
              <div className="flex h-full items-end gap-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <Skeleton className="h-32 w-full rounded-t-md" />
                  </div>
                ))}
              </div>
            ) : data?.visitHistory && data.visitHistory.length > 0 ? (
              <div className="flex min-h-0 flex-1 items-end gap-3">
                {(() => {
                  const maxCount = Math.max(...data.visitHistory.map((d) => d.count), 1);
                  return data.visitHistory.map((val, i) => {
                    const heightPct = (val.count / maxCount) * 100;
                    return (
                      <div key={i} className="group relative flex flex-1 flex-col items-center gap-2">
                        <span className="tabular-figures absolute -top-8 rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md opacity-0 transition-[opacity,transform] duration-base ease-out group-hover:-translate-y-1 group-hover:opacity-100">
                          {val.count}
                        </span>
                        <div className="flex w-full flex-1 items-end">
                          <div
                            className="w-full rounded-t-md bg-primary/80 transition-[height,background-color] duration-slow ease-out hover:bg-primary"
                            style={{ height: `${Math.max(heightPct, 5)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {new Date(val.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No visit data available for this period.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Visit Insights */}
          <Card className="shrink-0 border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="shrink-0 border-b border-border/40 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Visit Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 shadow-neu-sm">
                    <div className="flex items-center gap-3">
                      <PiChartLineUpBold size={18} className="text-info" />
                      <p className="text-sm font-medium text-foreground">Avg. Daily Visits</p>
                    </div>
                    <span className="text-lg font-bold text-foreground">{derived.avgDailyVisits}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 shadow-neu-sm">
                    <div className="flex items-center gap-3">
                      <PiTrendUpBold size={18} className="text-success" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Peak Day</p>
                        <p className="text-xs text-muted-foreground">{derived.peakDay}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-foreground">{derived.peakCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 shadow-neu-sm">
                    <div className="flex items-center gap-3">
                      <PiStarBold size={18} className="text-warning" />
                      <p className="text-sm font-medium text-foreground">Most Popular</p>
                    </div>
                    <span className="truncate max-w-[120px] text-sm font-bold text-foreground">{data?.summary.popularItem || "None"}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Device Breakdown (computed from user agent on visits - stays informational) */}
          <Card className="flex flex-col border-border/50 flex-1">
            <CardHeader className="shrink-0 border-b border-border/40 bg-muted/20 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Engagement Split</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 space-y-5 p-6">
              {loading ? (
                <div className="space-y-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (() => {
                const entries = Object.entries(data?.clickBreakdown || {}).filter(([, c]) => c > 0).sort(([, a], [, b]) => b - a);
                const total = entries.reduce((s, [, c]) => s + c, 0);
                if (entries.length === 0) {
                  return <div className="text-center text-sm text-muted-foreground py-4">No engagement data yet.</div>;
                }
                return entries.map(([target, count]) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  const colors = ['bg-info', 'bg-success', 'bg-primary', 'bg-warning', 'bg-destructive'];
                  const colorIdx = entries.findIndex(([t]) => t === target) % colors.length;
                  return (
                    <div key={target}>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium capitalize text-foreground">{target.replaceAll('_', ' ')}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">({count})</span>
                          <span className="tabular-figures text-sm font-semibold text-foreground">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${colors[colorIdx]} transition-[width] duration-1000 ease-out`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* New vs. Returning Visitors */}
      <Card className="shrink-0 border-border/50">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">New vs. Returning Visitors</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">{rangeLabels[range]}</p>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex h-48 items-end gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <Skeleton className="h-32 w-full rounded-t-md" />
                </div>
              ))}
            </div>
          ) : data?.visitorTrend && data.visitorTrend.length > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" />New</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary/30" />Returning</span>
              </div>
              <div className="flex h-48 items-end gap-3">
                {(() => {
                  const maxTotal = Math.max(...data.visitorTrend.map((d) => d.newVisitors + d.returningVisitors), 1);
                  return data.visitorTrend.map((day, i) => {
                    const dayTotal = day.newVisitors + day.returningVisitors;
                    const heightPct = (dayTotal / maxTotal) * 100;
                    const newPct = dayTotal > 0 ? (day.newVisitors / dayTotal) * 100 : 0;
                    return (
                      <div key={i} className="group relative flex flex-1 flex-col items-center gap-2">
                        <span className="tabular-figures absolute -top-8 rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md opacity-0 transition-[opacity,transform] duration-base ease-out group-hover:-translate-y-1 group-hover:opacity-100">
                          {day.newVisitors} new · {day.returningVisitors} returning
                        </span>
                        <div className="flex w-full flex-1 flex-col-reverse overflow-hidden rounded-t-md" style={{ height: `${Math.max(heightPct, 4)}%` }}>
                          <div className="w-full bg-primary/30" style={{ height: `${100 - newPct}%` }} />
                          <div className="w-full bg-primary" style={{ height: `${newPct}%` }} />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No visitor data available for this period.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Click & Event Breakdown */}
      <Card className="shrink-0 border-border/50">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">Click &amp; Event Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-5/6" />
              <Skeleton className="h-8 w-4/6" />
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(data?.clickBreakdown || {}).length > 0 ? (
                (() => {
                  const maxClick = Math.max(...Object.values(data!.clickBreakdown));
                  return Object.entries(data!.clickBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .map(([target, count], i) => {
                      const pct = maxClick > 0 ? (count / maxClick) * 100 : 0;
                      return (
                        <div key={target} className="flex items-center gap-4 group">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold text-muted-foreground transition-colors duration-base ease-out group-hover:bg-primary group-hover:text-primary-foreground">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="truncate text-sm font-semibold capitalize text-foreground">{target.replaceAll('_', ' ')}</p>
                              <span className="tabular-figures ml-2 shrink-0 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{count} clicks</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-primary transition-[width] duration-1000 ease-out"
                                style={{ width: `${Math.max(pct, 2)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    });
                })()
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No clicks recorded.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Menu Items & Top Searches */}
      <div className="grid shrink-0 grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <PiStarBold size={18} className="text-warning" />
              Top Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
              </div>
            ) : data?.topMenuItems && data.topMenuItems.length > 0 ? (
              <ul className="divide-y divide-border/40">
                {data.topMenuItems.map((item, i) => (
                  <li key={item.menuItemId} className="flex items-center gap-3 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{item.item}</p>
                    <span className="shrink-0 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {item.count} views
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">No menu item activity yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <PiMagnifyingGlassBold size={18} className="text-destructive" />
              Top Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
              </div>
            ) : data?.topSearches && data.topSearches.length > 0 ? (
              <ul className="divide-y divide-border/40">
                {data.topSearches.map((s, i) => (
                  <li key={`${s.query}-${i}`} className="flex items-center gap-3 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{s.query}</p>
                    <span className="shrink-0 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {s.count} searches
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">No searches recorded yet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Menu Performance & Zero-Result Searches */}
      <div className="grid shrink-0 grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <PiForkKnifeBold size={18} className="text-primary" />
              Menu Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {menuStatsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full rounded-lg" />)}
              </div>
            ) : menuStats ? (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/40 p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{menuStats.total}</p>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Items</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-3 text-center">
                    <p className="text-2xl font-bold text-success">{menuStats.available}</p>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Available</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-3 text-center">
                    <p className="text-2xl font-bold text-warning">{menuStats.popular}</p>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Popular</p>
                  </div>
                </div>
                {menuStats.unavailable > 0 && (
                  <p className="text-xs font-medium text-destructive">{menuStats.unavailable} item{menuStats.unavailable !== 1 ? 's' : ''} currently marked unavailable</p>
                )}
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">By Category</p>
                  {menuStats.byCategory.slice(0, 6).map((c) => {
                    const pct = menuStats.total > 0 ? (c.count / menuStats.total) * 100 : 0;
                    return (
                      <div key={c.category}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{c.category}</span>
                          <span className="text-muted-foreground">{c.count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-1.5 rounded-full bg-primary transition-[width] duration-1000 ease-out" style={{ width: `${Math.max(pct, 3)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">No menu items yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <PiSmileySadBold size={18} className="text-warning" />
              Searches With No Results
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Guests looking for dishes you may not have.</p>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
              </div>
            ) : data?.zeroResultSearches && data.zeroResultSearches.length > 0 ? (
              <ul className="divide-y divide-border/40">
                {data.zeroResultSearches.map((s, i) => (
                  <li key={`${s.query}-${i}`} className="flex items-center gap-3 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{s.query}</p>
                    <span className="shrink-0 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {s.count}×
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">No zero-result searches — nice!</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Visitors */}
      <Card className="shrink-0 border-border/50">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <PiUsersBold size={18} className="text-primary" />
                Visitors
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Every unique guest who has viewed your menu or landing page.</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => downloadCsv('/analytics/visitors/export.csv', 'visitors.csv').catch(() => {})}
              leftIcon={<PiDownloadSimpleBold size={14} />}
              className="w-full sm:w-auto"
            >
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {visitorsLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
            </div>
          ) : visitorsPage && visitorsPage.visitors.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-6 py-3">Visitor</th>
                      <th className="px-6 py-3">Device</th>
                      <th className="px-6 py-3">First Seen</th>
                      <th className="px-6 py-3">Last Seen</th>
                      <th className="px-6 py-3 text-right">Visits</th>
                      <th className="px-6 py-3 text-right">Clicks</th>
                      <th className="px-6 py-3 text-right">Searches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {visitorsPage.visitors.map((v) => (
                      <tr key={v.visitorId} className="transition-colors duration-base ease-out hover:bg-muted/30">
                        <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{v.visitorId.slice(0, 8)}…</td>
                        <td className="px-6 py-3 text-foreground">{formatDeviceLabel(v.userAgent)}</td>
                        <td className="px-6 py-3 text-muted-foreground">{new Date(v.firstSeen).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-muted-foreground">{new Date(v.lastSeen).toLocaleString()}</td>
                        <td className="px-6 py-3 text-right tabular-figures font-semibold text-foreground">{v.visits}</td>
                        <td className="px-6 py-3 text-right tabular-figures font-semibold text-foreground">{v.clicks}</td>
                        <td className="px-6 py-3 text-right tabular-figures font-semibold text-foreground">{v.searches}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border/40 p-4">
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
            <div className="py-10 text-center text-sm text-muted-foreground">No visitors recorded yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
