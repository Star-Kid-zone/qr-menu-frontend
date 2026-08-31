'use client';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { analyticsService, type DashboardData } from "@/services/analytics.service";
import { workspaceService, type WorkspaceData } from "@/services/workspace.service";
import { menuService, type MenuStats } from "@/services/menu.service";
import { deriveAnalyticsMetrics } from "@/utils/analyticsMetrics";
import { getApiErrorMessage } from "@/utils/errors";
import {
  PiCheckCircleFill,
  PiCircleDashedBold,
  PiCursorClickBold,
  PiImagesBold,
  PiPlusBold,
  PiQrCodeBold,
  PiStarFill,
  PiStorefrontBold,
  PiTicketBold,
  PiTrendUpBold,
  PiUsersBold,
  PiWarningCircleBold,
  PiArrowRightBold,
  PiArrowSquareOutBold,
  PiCreditCardBold,
  PiGoogleLogoBold,
  PiSparkleFill,
  PiChartLineUpBold,
} from "react-icons/pi";

interface HealthCheck {
  label: string;
  done: boolean;
  href: string;
}

export default function AdminHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [menuStats, setMenuStats] = useState<MenuStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [dashboardData, workspaceRes, menuStatsRes] = await Promise.all([
          analyticsService.getDashboard('30d'),
          workspaceService.getWorkspace(),
          menuService.getStats(),
        ]);
        setData(dashboardData);
        setWorkspace(workspaceRes.data);
        setMenuStats(menuStatsRes.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load dashboard data"));
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const healthChecks: HealthCheck[] = useMemo(() => {
    if (!workspace) return [];
    const socialLinksCount = Array.isArray(workspace.business?.socialLinks) ? workspace.business!.socialLinks.length : 0;
    return [
      { label: "Menu items added", done: (menuStats?.total ?? 0) > 0, href: "/admin/listmenu" },
      { label: "Review link set", done: !!workspace.review.googleReviewLink, href: "/admin/listreview" },
      { label: "Payment configured", done: !!(workspace.payment.link || workspace.payment.qrImage), href: "/admin/listpayment" },
      { label: "QR code generated", done: !!workspace.qrCode?.url, href: "/admin/addqrcode" },
      {
        label: "Business profile complete",
        done: !!(workspace.business?.name && workspace.business?.phone && workspace.business?.address),
        href: "/admin/listbusiness",
      },
      { label: "Social links added", done: socialLinksCount > 0, href: "/admin/social-media" },
      { label: "Gallery has images", done: workspace.gallery.length > 0, href: "/admin/listbusiness" },
      { label: "Offers active", done: workspace.offers.some((o) => o.isActive), href: "/admin/listbusiness" },
      { label: "Announcement configured", done: workspace.announcement.enabled && !!workspace.announcement.text?.trim(), href: "/admin/listbusiness" },
    ];
  }, [workspace, menuStats]);

  const healthDoneCount = healthChecks.filter((c) => c.done).length;
  const healthPct = healthChecks.length > 0 ? Math.round((healthDoneCount / healthChecks.length) * 100) : 0;
  const firstIncompleteCheck = healthChecks.find((c) => !c.done);

  const derived = useMemo(() => deriveAnalyticsMetrics(data), [data]);

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <PiWarningCircleBold className="size-7 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Failed to load dashboard</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Visits",
      value: data?.summary.totalVisits.toLocaleString() || "0",
      subtext: data?.today.visits ? `+${data.today.visits} today` : "Live traffic",
      icon: <PiUsersBold size={18} />,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Unique Visitors",
      value: data?.summary.uniqueVisitors.toLocaleString() || "0",
      subtext: data?.today.newVisitors ? `+${data.today.newVisitors} new today` : "Distinct customers",
      icon: <PiQrCodeBold size={18} />,
      color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50",
    },
    {
      label: "Total Clicks",
      value: data?.summary.totalClicks.toLocaleString() || "0",
      subtext: data?.today.events ? `+${data.today.events} actions today` : "Link & button interactions",
      icon: <PiCursorClickBold size={18} />,
      color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/50",
    },
    {
      label: "Conversion Rate",
      value: `${derived.conversionRate}%`,
      subtext: "Clicks per visit",
      icon: <PiTrendUpBold size={18} />,
      color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50",
    },
  ];

  const clickBreakdownEntries = Object.entries(data?.clickBreakdown || {}).sort(([, a], [, b]) => b - a);
  const totalClicks = derived.totalClickSum || 1;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1 pb-6">

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">
              {workspace?.business?.name || "Dashboard"}
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Overview & performance for the last 30 days</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/addmenu"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <PiPlusBold size={13} />
            Add Menu Item
          </Link>
          <Link
            href="/admin/listbusiness"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            <PiStorefrontBold size={13} className="text-muted-foreground" />
            Business Profile
          </Link>
          <Link
            href="/admin/addqrcode"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            <PiQrCodeBold size={13} className="text-muted-foreground" />
            Generate QR
          </Link>
          <Link
            href="/admin/analytics"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            <PiChartLineUpBold size={13} className="text-muted-foreground" />
            Analytics
          </Link>
        </div>
      </div>

      {/* ─── Compact Setup Status (Only takes minimal room) ─────────────── */}
      {!loading && healthChecks.length > 0 && (
        <div className="shrink-0 rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PiSparkleFill size={14} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-foreground">
                    Store Setup {healthPct === 100 ? "Complete" : `${healthDoneCount}/${healthChecks.length} Ready`}
                  </p>
                  <span className="text-[10px] font-semibold text-muted-foreground">({healthPct}%)</span>
                </div>
                {firstIncompleteCheck ? (
                  <p className="text-[11px] text-muted-foreground">
                    Next step: <Link href={firstIncompleteCheck.href} className="font-semibold text-primary hover:underline">{firstIncompleteCheck.label} →</Link>
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    All core features and configurations are active.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden h-2 w-28 overflow-hidden rounded-full bg-muted sm:block">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${healthPct}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowChecklist(!showChecklist)}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground"
              >
                {showChecklist ? "Hide Checklist" : "View Checklist"}
              </button>
            </div>
          </div>

          {/* Expandable checklist */}
          {showChecklist && (
            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-border pt-3 sm:grid-cols-2 lg:grid-cols-3">
              {healthChecks.map((check) => (
                <Link
                  key={check.label}
                  href={check.href}
                  className="flex items-center gap-2 rounded-lg p-1.5 text-xs transition hover:bg-muted/60"
                >
                  {check.done ? (
                    <PiCheckCircleFill size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <PiCircleDashedBold size={15} className="shrink-0 text-muted-foreground/40" />
                  )}
                  <span className={check.done ? "text-foreground" : "text-muted-foreground"}>{check.label}</span>
                  {!check.done && (
                    <span className="ml-auto text-[10px] font-bold text-primary">Setup →</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 4 Primary KPI Cards ────────────────────────────────────────── */}
      <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{stat.label}</span>
              <div className={`flex size-8 items-center justify-center rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-2">
              {loading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <p className="text-2xl font-bold tabular-figures text-foreground">{stat.value}</p>
              )}
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Main Grid: Visit Trends (2 cols) + Performance Insights (1 col) ─── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Left Column (2/3): Visit Trends & Click Breakdown */}
        <div className="flex flex-col gap-4 lg:col-span-2">

          {/* Visit Trends Chart */}
          <Card className="rounded-xl border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-foreground">Customer Visit Trends</CardTitle>
                  <p className="text-xs text-muted-foreground">Daily visitors over the last 30 days</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary" />
                    <span>Avg: <strong className="text-foreground">{derived.avgDailyVisits}</strong>/day</span>
                  </div>
                  <Link
                    href="/admin/analytics"
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    Details
                    <PiArrowRightBold size={10} />
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col p-5">
              {loading ? (
                <div className="flex h-44 items-end gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 flex-1 rounded-t" />
                  ))}
                </div>
              ) : data?.visitHistory && data.visitHistory.length > 0 ? (
                <div>
                  <div className="flex h-44 items-end gap-1.5 pt-4">
                    {(() => {
                      const maxCount = Math.max(...data.visitHistory.map((d) => d.count), 1);
                      return data.visitHistory.map((day, i) => {
                        const heightPct = (day.count / maxCount) * 100;
                        return (
                          <div key={i} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-0.5 text-[10px] font-semibold text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100 z-10">
                              {day.count} visits
                            </span>
                            <div
                              className="w-full rounded-t bg-primary/70 transition-all duration-150 hover:bg-primary"
                              style={{ height: `${Math.max(heightPct, 4)}%` }}
                            />
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="mt-3 flex justify-between border-t border-border pt-2 text-[10px] font-medium text-muted-foreground">
                    <span>{data.visitHistory[0]?.date}</span>
                    <span>Peak Day: <strong className="text-foreground">{derived.peakDay} ({derived.peakCount} visits)</strong></span>
                    <span>{data.visitHistory[data.visitHistory.length - 1]?.date}</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center text-xs text-muted-foreground">
                  No visit history yet. Scan the QR code to record your first visit.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Click Distribution */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Customer Activity</p>
                <p className="text-sm font-semibold text-foreground">Click Breakdown</p>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {data?.summary.totalClicks || 0} total interactions
              </span>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : clickBreakdownEntries.length > 0 ? (
              <div className="space-y-3">
                {clickBreakdownEntries.map(([target, count]) => {
                  const pct = Math.round((count / totalClicks) * 100);
                  return (
                    <div key={target} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="capitalize text-foreground">{target.replaceAll('_', ' ')}</span>
                        <span className="text-muted-foreground">{count} clicks ({pct}%)</span>
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
              <p className="py-4 text-center text-xs text-muted-foreground">
                No customer interactions recorded yet.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (1/3): Highlights & Modules */}
        <div className="flex flex-col gap-4">

          {/* Top Highlights Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Store Performance</p>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <PiStarFill size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Most Popular Item</p>
                <p className="truncate text-sm font-bold text-foreground">
                  {data?.summary.popularItem || "None recorded yet"}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Menu Items</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{menuStats?.total ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Active Offers</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">
                  {workspace?.offers.filter((o) => o.isActive).length ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Connected Modules & Integrations */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Features & Integrations</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
                <div className="flex items-center gap-2">
                  <PiGoogleLogoBold size={16} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">Google Reviews</span>
                </div>
                {workspace?.review?.googleReviewLink ? (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    Active
                  </span>
                ) : (
                  <Link href="/admin/addreview" className="text-[10px] font-bold text-primary hover:underline">
                    Connect →
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
                <div className="flex items-center gap-2">
                  <PiCreditCardBold size={16} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">Payment Gateway</span>
                </div>
                {workspace?.payment?.link || workspace?.payment?.qrImage ? (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    Active
                  </span>
                ) : (
                  <Link href="/admin/addpayment" className="text-[10px] font-bold text-primary hover:underline">
                    Set up →
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
                <div className="flex items-center gap-2">
                  <PiImagesBold size={16} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">Gallery Images</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {workspace?.gallery?.length ?? 0} photos
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
                <div className="flex items-center gap-2">
                  <PiTicketBold size={16} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">Special Offers</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {workspace?.buttons?.specialOfferStatus ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick links banner */}
          {workspace?.publicSlug && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">Your Public Menu</p>
                  <p className="text-[11px] text-muted-foreground">View what your customers see</p>
                </div>
                <a
                  href={`/${workspace.publicSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-7 items-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Visit <PiArrowSquareOutBold size={12} />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
