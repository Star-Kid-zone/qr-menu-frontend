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
import { PageHeader } from "@/components/ui/PageHeader";
import { getApiErrorMessage } from "@/utils/errors";
import {
  PiCheckCircleBold,
  PiChartLineUpBold,
  PiCircleBold,
  PiClockBold,
  PiCursorClickBold,
  PiGiftBold,
  PiImagesBold,
  PiPlusBold,
  PiQrCodeBold,
  PiStarBold,
  PiStorefrontBold,
  PiTicketBold,
  PiTrendUpBold,
  PiUsersBold,
  PiWarningCircleBold,
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

  const featureAdoption = useMemo(() => {
    if (!workspace) return [];
    return [
      { label: "Special Offers", enabled: workspace.buttons.specialOfferStatus, count: workspace.offers.filter((o) => o.isActive).length, icon: <PiTicketBold size={16} /> },
      { label: "Gallery", enabled: workspace.gallery.length > 0, count: workspace.gallery.length, icon: <PiImagesBold size={16} /> },
      { label: "Lottery", enabled: workspace.buttons.lotteryStatus, count: null, icon: <PiGiftBold size={16} /> },
    ];
  }, [workspace]);

  // Derived metrics shared with admin/analytics via deriveAnalyticsMetrics()
  const derived = useMemo(() => deriveAnalyticsMetrics(data), [data]);

  if (error) {
    return (
      <div className="animate-fade-in-up flex h-full flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-10 text-center">
        <PiWarningCircleBold className="size-12 text-destructive" />
        <h3 className="text-h2 text-foreground">Failed to load dashboard</h3>
        <p className="max-w-sm text-body text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Visits",
      value: data?.summary.totalVisits.toLocaleString() || "0",
      icon: <PiUsersBold size={20} />,
    },
    {
      label: "Unique Visitors",
      value: data?.summary.uniqueVisitors.toLocaleString() || "0",
      icon: <PiQrCodeBold size={20} />,
    },
    {
      label: "Total Clicks",
      value: data?.summary.totalClicks.toLocaleString() || "0",
      icon: <PiCursorClickBold size={20} />,
    },
    {
      label: "Conversion Rate",
      value: `${derived.conversionRate}%`,
      icon: <PiTrendUpBold size={20} />,
    },
  ];

  const quickActions = [
    { name: "Add Menu", href: "/admin/addmenu", icon: <PiPlusBold size={18} /> },
    { name: "Business Profile", href: "/admin/listbusiness?tab=businesses", icon: <PiStorefrontBold size={18} /> },
    { name: "Generate QR", href: "/admin/addqrcode", icon: <PiQrCodeBold size={18} /> },
    { name: "View Analytics", href: "/admin/analytics", icon: <PiChartLineUpBold size={18} /> },
  ];

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto pb-6">
      {/* Header & Quick Actions */}
      <PageHeader
        className="shrink-0"
        title="Dashboard Overview"
        description="Monitor your store's performance over the last 30 days."
        actions={
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center gap-2 whitespace-nowrap rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors duration-base ease-out hover:bg-primary hover:text-primary-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
              >
                {action.icon}
                {action.name}
              </Link>
            ))}
          </div>
        }
      />

      {/* Today */}
      <div className="animate-fade-in-up shrink-0 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <PiClockBold size={16} />
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

      {/* Site Health */}
      <Card className="animate-fade-in-up shrink-0 border-border/50" style={{ animationDelay: "40ms" }}>
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Site Health</CardTitle>
            {!loading && healthChecks.length > 0 && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {healthDoneCount}/{healthChecks.length} set up
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {healthChecks.map((check) => (
                <Link
                  key={check.label}
                  href={check.href}
                  className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors duration-base ease-out hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                >
                  {check.done ? (
                    <PiCheckCircleBold size={18} className="shrink-0 text-success" />
                  ) : (
                    <PiCircleBold size={18} className="shrink-0 text-muted-foreground/40" />
                  )}
                  <span className={check.done ? "text-foreground" : "text-muted-foreground"}>{check.label}</span>
                  {!check.done && (
                    <span className="ml-auto shrink-0 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Fix →
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Stats Grid */}
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={stat.label}
            className="animate-fade-in-up border-border/50 bg-card shadow-neu-sm transition-shadow duration-base ease-out hover:shadow-neu"
            style={{ animationDelay: `${80 + i * 40}ms` }}
          >
            <CardContent className="flex flex-col gap-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                {loading ? (
                  <Skeleton className="mt-1.5 h-8 w-24" />
                ) : (
                  <p className="mt-1 text-3xl font-bold tracking-tight text-foreground tabular-figures">{stat.value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="animate-fade-in-up grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-3" style={{ animationDelay: "160ms" }}>
        {/* Left Column - Chart */}
        <Card className="flex flex-col lg:col-span-2 border-border/50">
          <CardHeader className="shrink-0 border-b border-border/40 bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Visit Trends</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Daily visitors over the last 30 days</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <PiChartLineUpBold size={14} />
                Live
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[300px] flex-1 flex-col p-6">
            {loading ? (
              <div className="flex h-full items-end gap-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <Skeleton className="h-32 w-full rounded-t-sm" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {data?.visitHistory && data.visitHistory.length > 0 ? (
                  <div className="flex min-h-0 flex-1 items-end gap-2">
                    {(() => {
                      const maxCount = Math.max(...data.visitHistory.map((d) => d.count), 1);
                      return data.visitHistory.map((day, i) => {
                        const heightPct = (day.count / maxCount) * 100;
                        return (
                          <div key={i} className="group relative flex flex-1 flex-col items-center gap-1">
                            <span className="tabular-figures absolute -top-8 rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md opacity-0 transition-[opacity,transform] duration-base ease-out group-hover:-translate-y-1 group-hover:opacity-100">
                              {day.count}
                            </span>
                            <div
                              className="w-full rounded-t-sm bg-primary/80 transition-[height,background-color] duration-slow ease-out hover:bg-primary"
                              style={{ height: `${Math.max(heightPct, 5)}%` }}
                            />
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
                <div className="mt-4 flex shrink-0 justify-between text-xs font-medium text-muted-foreground border-t border-border/40 pt-3">
                  {data?.visitHistory?.slice(0, 1).map((m) => <span key={m.date}>{m.date}</span>)}
                  {data?.visitHistory?.slice(-1).map((m) => <span key={m.date}>{m.date}</span>)}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="flex flex-col gap-6">

          {/* Highlights */}
          <Card className="shrink-0 border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PiStarBold size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Most Popular Item</p>
                  {loading ? (
                    <Skeleton className="mt-1 h-6 w-32" />
                  ) : (
                    <p className="mt-1 truncate text-lg font-bold text-foreground">
                      {data?.summary.popularItem || "None"}
                    </p>
                  )}
                </div>
              </div>
              <div className="h-px bg-border/50" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Avg. Daily Visits</p>
                  {loading ? <Skeleton className="mt-1 h-6 w-14" /> : (
                    <p className="mt-1 text-xl font-bold text-foreground">{derived.avgDailyVisits}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Peak Day</p>
                  {loading ? <Skeleton className="mt-1 h-6 w-14" /> : (
                    <p className="mt-1 text-xl font-bold text-foreground">{derived.peakDay}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Adoption */}
          <Card className="shrink-0 border-border/50">
            <CardHeader className="shrink-0 border-b border-border/40 bg-muted/20 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Feature Adoption</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-lg" />)}
                </div>
              ) : (
                <ul className="divide-y divide-border/40">
                  {featureAdoption.map((f) => (
                    <li key={f.label} className="flex items-center justify-between py-2.5 px-2">
                      <div className="flex items-center gap-2.5">
                        <span className={f.enabled ? "text-primary" : "text-muted-foreground/50"}>{f.icon}</span>
                        <span className={`text-sm font-medium ${f.enabled ? "text-foreground" : "text-muted-foreground"}`}>{f.label}</span>
                      </div>
                      {f.enabled ? (
                        f.count !== null ? (
                          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{f.count}</span>
                        ) : (
                          <span className="text-xs font-semibold text-success">On</span>
                        )
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground/60">Off</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Click Breakdown */}
          <Card className="flex flex-col border-border/50 flex-1">
            <CardHeader className="shrink-0 border-b border-border/40 bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <PiClockBold className="text-primary" size={20} />
                Click Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-2 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="divide-y divide-border/40">
                  {Object.entries(data?.clickBreakdown || {}).length > 0 ? (
                    Object.entries(data!.clickBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([target, count], i) => {
                        const totalClicks = Object.values(data!.clickBreakdown).reduce((s, v) => s + v, 0);
                        const pct = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                        return (
                          <li key={i} className="flex items-center justify-between p-4 transition-colors duration-base ease-out hover:bg-muted/30">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold uppercase text-primary">
                                {target[0]}
                              </span>
                              <p className="text-sm font-medium capitalize text-foreground">
                                {target.replaceAll('_', ' ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{pct}%</span>
                              <span className="tabular-figures text-sm font-semibold text-foreground">{count}</span>
                            </div>
                          </li>
                        );
                      })
                  ) : (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No clicks recorded.
                    </div>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
