'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { analyticsService, type DashboardData } from '@/services/analytics.service';
import { workspaceService, type WorkspaceData } from '@/services/workspace.service';
import { menuService, type MenuStats } from '@/services/menu.service';
import { deriveAnalyticsMetrics } from '@/utils/analyticsMetrics';
import { getApiErrorMessage } from '@/utils/errors';
import { downloadCsv } from '@/utils/downloadCsv';
import { toast } from '@/components/ui/toast';
import { cn } from '@/utils/cn';
import {
  PiCursorClickBold,
  PiPlusBold,
  PiQrCodeBold,
  PiStorefrontBold,
  PiTrendUpBold,
  PiUsersBold,
  PiWarningCircleBold,
  PiMagnifyingGlassBold,
  PiDownloadSimpleBold,
} from 'react-icons/pi';
import type { RangeKey, StatCardItem } from '../types';
import { AdminDashboardKpis } from './AdminDashboardKpis';
import { TrafficTrendsCard } from './TrafficTrendsCard';
import { VisitorRetentionCard } from './VisitorRetentionCard';
import { SearchIntelligenceCard } from './SearchIntelligenceCard';
import { MenuCatalogCard } from './MenuCatalogCard';

const rangeLabels: Record<RangeKey, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  'all': 'All Time',
};

export function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>('30d');

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
        workspaceService.getWorkspace(),
        menuService.getStats(),
      ]);

      if (!mounted) return;

      if (wsResult.status === 'fulfilled') {
        setWorkspace(wsResult.value.data);
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
  }, [range]);

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

  const statCards: StatCardItem[] = [
    {
      label: 'Total Visits',
      value: data?.summary.totalVisits.toLocaleString() || '0',
      subtext: data?.today.visits ? `+${data.today.visits} today` : `Avg ${derived.avgDailyVisits}/day`,
      icon: <PiUsersBold size={18} />,
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Unique Visitors',
      value: data?.summary.uniqueVisitors.toLocaleString() || '0',
      subtext: data?.today.newVisitors ? `+${data.today.newVisitors} new today` : 'Distinct customers',
      icon: <PiQrCodeBold size={18} />,
      color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50',
    },
    {
      label: 'Total Clicks',
      value: data?.summary.totalClicks.toLocaleString() || '0',
      subtext: data?.today.events ? `+${data.today.events} actions today` : 'Link & button interactions',
      icon: <PiCursorClickBold size={18} />,
      color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/50',
    },
    {
      label: 'Menu Searches',
      value: data?.summary.totalSearches.toLocaleString() || '0',
      subtext: data?.today.searches ? `+${data.today.searches} today` : 'Guest dish searches',
      icon: <PiMagnifyingGlassBold size={18} />,
      color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50',
    },
    {
      label: 'Conversion Rate',
      value: `${derived.conversionRate}%`,
      subtext: 'Clicks per visit',
      icon: <PiTrendUpBold size={18} />,
      color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50',
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1 pb-6">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">
              {workspace?.business?.name || 'Dashboard'}
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Overview & performance · {rangeLabels[range]}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range switcher */}
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5 shadow-xs">
            {(['7d', '30d', 'all'] as RangeKey[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  range === r
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                )}
              >
                {r === '7d' ? '7D' : r === '30d' ? '30D' : 'All'}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 text-xs"
            leftIcon={<PiDownloadSimpleBold size={13} />}
            onClick={() =>
              downloadCsv('/analytics/visitors/export.csv', 'visitors-analytics.csv').catch(() =>
                toast.error('Failed to export CSV'),
              )
            }
          >
            Export
          </Button>

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
        </div>
      </div>

      {/* ─── 5 Primary KPI Cards ────────────────────────────────────────── */}
      <AdminDashboardKpis statCards={statCards} loading={loading} />

      {/* ─── Main Grid: Visit Trends ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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

      {/* ─── Secondary Section: Search Intelligence & Menu Health ─────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SearchIntelligenceCard
          data={data}
          loading={loading}
        />
        <MenuCatalogCard
          menuStats={menuStats}
          loading={menuStatsLoading}
        />
      </div>
    </div>
  );
}
