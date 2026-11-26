'use client';

import { loadWorkspace } from '@/hooks/useWorkspace';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Notice } from '@/components/ui/Notice';
import { SetupChecklist, SiteStatusCard } from './HomeStatus';
import { analyticsService, type DashboardData } from '@/services/analytics.service';
import type { WorkspaceData } from '@/services/workspace.service';
import { menuService, type MenuStats } from '@/services/menu.service';
import { deriveAnalyticsMetrics } from '@/utils/analyticsMetrics';
import { pctChange } from '@/utils/dashboardInsights';
import { getApiErrorMessage } from '@/utils/errors';
import { downloadCsv } from '@/utils/downloadCsv';
import { toast } from '@/components/ui/toast';
import { cn } from '@/utils/cn';
import {
  PiCursorClickBold,
  PiQrCodeBold,
  PiTrendUpBold,
  PiUsersBold,
  PiMagnifyingGlassBold,
  PiDownloadSimpleBold,
} from 'react-icons/pi';
import type { RangeKey, StatCardItem } from '../types';
import { AdminDashboardKpis } from './AdminDashboardKpis';
import { TrafficTrendsCard } from './TrafficTrendsCard';
import { VisitorRetentionCard } from './VisitorRetentionCard';
import { SearchIntelligenceCard } from './SearchIntelligenceCard';
import { MenuCatalogCard } from './MenuCatalogCard';
import { MostViewedDishesCard } from './MostViewedDishesCard';
import { TrafficSourcesCard } from './TrafficSourcesCard';
import { BusiestHoursCard } from './BusiestHoursCard';
import { TodayPanel } from './TodayPanel';
import { FirstScansGuide } from './FirstScansGuide';
import { DASHBOARD_RANGE_LABELS } from '@/constants/analytics.constants';

const rangeLabels: Record<RangeKey, string> = DASHBOARD_RANGE_LABELS;

export function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>('30d');
  const [reloadKey, setReloadKey] = useState(0);

  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);

  const [menuStats, setMenuStats] = useState<MenuStats | null>(null);
  const [menuStatsLoading, setMenuStatsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Load dashboard secondary context (workspace & menu stats) concurrently on mount
  useEffect(() => {
    let mounted = true;
    async function loadContext() {
      setMenuStatsLoading(true);
      const [wsResult, menuResult] = await Promise.allSettled([
        loadWorkspace(),
        menuService.getStats(),
      ]);

      if (!mounted) return;

      if (wsResult.status === 'fulfilled') {
        setWorkspace(wsResult.value);
      } else {
        console.warn('Non-blocking: Failed to load workspace data', wsResult.reason);
      }

      if (menuResult.status === 'fulfilled') {
        setMenuStats(menuResult.value.data);
      } else {
        console.warn('Non-blocking: Failed to load menu stats', menuResult.reason);
      }
      setMenuStatsLoading(false);
    }

    loadContext();
    return () => {
      mounted = false;
    };
  }, []);

  // Load analytics whenever the range filter changes
  useEffect(() => {
    let mounted = true;
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const res = await analyticsService.getDashboard(range);
        if (mounted) {
          setData(res);
        }
      } catch (err) {
        if (mounted) {
          setError(getApiErrorMessage(err, 'Failed to load dashboard data'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [range, reloadKey]);

  const derived = useMemo(() => deriveAnalyticsMetrics(data), [data]);

  const prev = data?.previous ?? null;
  const deltaLabel = range === '7d' ? 'vs prev 7d' : 'vs prev 30d';
  const mkDelta = (cur: number | undefined, before: number | undefined) => {
    if (!prev || cur == null) return null;
    if (cur === 0 && (before ?? 0) === 0) return null;
    const pct = pctChange(cur, before);
    return pct == null ? null : { pct, label: deltaLabel };
  };
  const hasNoActivity =
    !loading &&
    !error &&
    data !== null &&
    data.summary.totalVisits === 0 &&
    data.summary.totalClicks === 0 &&
    data.summary.totalSearches === 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const statCards: StatCardItem[] = [
    {
      label: 'Visits',
      value: data?.summary.totalVisits.toLocaleString() || '0',
      subtext: data?.today.visits ? `+${data.today.visits} today` : `Avg ${derived.avgDailyVisits}/day`,
      delta: mkDelta(data?.summary.totalVisits, prev?.visits),
      icon: <PiUsersBold size={18} />,
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Guests',
      value: data?.summary.uniqueVisitors.toLocaleString() || '0',
      subtext: data?.today.newVisitors ? `+${data.today.newVisitors} new today` : 'Unique devices',
      delta: mkDelta(data?.summary.uniqueVisitors, prev?.visitors),
      icon: <PiQrCodeBold size={18} />,
      color: 'text-info bg-info/10 dark:text-info dark:bg-info/50',
    },
    {
      label: 'Button taps',
      value: data?.summary.totalClicks.toLocaleString() || '0',
      subtext: data?.today.clicks ? `+${data.today.clicks} today` : 'Pay, Call & Directions',
      delta: mkDelta(data?.summary.totalClicks, prev?.clicks),
      icon: <PiCursorClickBold size={18} />,
      color: 'text-primary bg-primary/10 dark:text-primary dark:bg-primary/50',
    },
    {
      label: 'Menu searches',
      value: data?.summary.totalSearches.toLocaleString() || '0',
      subtext: data?.today.searches ? `+${data.today.searches} today` : 'On your menu',
      delta: mkDelta(data?.summary.totalSearches, prev?.searches),
      icon: <PiMagnifyingGlassBold size={18} />,
      color: 'text-warning-foreground bg-warning/10 dark:text-warning dark:bg-warning/50',
    },
    {
      label: 'Visits with a tap',
      value: `${derived.conversionRate}%`,
      subtext: 'Taps per visit',
      icon: <PiTrendUpBold size={18} />,
      color: 'text-success bg-success/10 dark:text-success dark:bg-success/50',
    },
  ];

  const headerDescription =
    data && !loading && data.summary.uniqueVisitors > 0 && range !== 'all'
      ? `${greeting}. ${data.summary.uniqueVisitors.toLocaleString()} ${data.summary.uniqueVisitors === 1 ? 'guest' : 'guests'} visited in the ${rangeLabels[range].toLowerCase()}.`
      : data && !loading && data.summary.uniqueVisitors === 0
        ? `${greeting}. Your menu is ready for guests.`
        : `${greeting}. Here is how your website is doing.`;

  return (
    <PageContainer>
      <PageHeader
        title={workspace?.business?.name || "Home"}
        description={headerDescription}
      />

      <SiteStatusCard workspace={workspace} />
      <SetupChecklist workspace={workspace} menuStats={menuStats} />
      <TodayPanel data={data} menuStats={menuStats} />

      {/* Visits: the date filter sits with the numbers it controls. */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-h2 text-foreground">Visits</h2>
          <p className="text-body text-muted-foreground">{rangeLabels[range]}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Date range" className="flex rounded-md border border-input p-0.5">
            {(['7d', '30d', 'all'] as RangeKey[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={cn(
                  'rounded px-3 py-2 text-body-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
                  range === r ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {r === '7d' ? '7 days' : r === '30d' ? '30 days' : 'All time'}
              </button>
            ))}
          </div>
          {!hasNoActivity ? (
            <Button
              type="button"
              variant="secondary"
              leftIcon={<PiDownloadSimpleBold size={16} />}
              onClick={() =>
                downloadCsv('/analytics/visitors/export.csv', 'visitors-analytics.csv').catch(() =>
                  toast.error("Couldn't download the file. Try again."),
                )
              }
            >
              Export
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <Notice
          tone="error"
          title="We couldn't load your visit numbers"
          action={
            <Button size="sm" variant="secondary" onClick={() => setReloadKey((k) => k + 1)}>
              Try again
            </Button>
          }
        >
          {error}
        </Notice>
      ) : null}

      {hasNoActivity ? (
        <>
          <FirstScansGuide
            range={range}
            onShowAllTime={range !== 'all' ? () => setRange('all') : undefined}
          />
          <MenuCatalogCard menuStats={menuStats} loading={menuStatsLoading} />
        </>
      ) : (
        <>
          {/* ─── 5 Primary KPI Cards ────────────────────────────────────────── */}
          <AdminDashboardKpis statCards={statCards} loading={loading} />

          {/* ─── Main Grid: Visit Trends ───────────────────────────────────── */}
          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <TrafficTrendsCard
              data={data}
              loading={loading}
              rangeLabel={rangeLabels[range]}
              derived={derived}
            />
            <VisitorRetentionCard
              data={data}
              loading={loading}
            />
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <MostViewedDishesCard data={data} loading={loading} />
            <BusiestHoursCard data={data} loading={loading} />
          </div>

          <TrafficSourcesCard data={data} loading={loading} />

          {/* ─── Secondary Section: Search Intelligence & Menu Health ─────── */}
          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <SearchIntelligenceCard
              data={data}
              loading={loading}
            />
            <MenuCatalogCard
              menuStats={menuStats}
              loading={menuStatsLoading}
            />
          </div>
        </>
      )}
    </PageContainer>
  );
}
