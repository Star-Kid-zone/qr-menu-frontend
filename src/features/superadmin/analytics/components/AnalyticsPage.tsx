'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  superadminService,
  type DateRange,
  type PlatformAnalyticsOverview,
  type AnalyticsByUserResponse,
} from '@/services/superadmin.service';
import { PageHeader, Card, Button, Select, SubTabPills } from '@/components/ui';
import {
  PiUsersBold,
  PiCursorClickBold,
  PiWarningBold,
  PiArrowClockwiseBold,
  PiDownloadSimpleBold,
  PiStorefrontBold,
  PiTargetBold,
  PiEyeBold,
} from 'react-icons/pi';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';
import { TAB_OPTIONS } from '../constants';
import type { TabId } from '../types';
import { MetricCard } from './MetricCard';
import { TrafficFunnelTab } from './TrafficFunnelTab';
import { SearchDemandTab } from './SearchDemandTab';
import { TopDishesTab } from './TopDishesTab';
import { PeakTimeTechTab } from './PeakTimeTechTab';
import { TenantLeaderboardTab } from './TenantLeaderboardTab';

export function AnalyticsPage() {
  const reduceMotion = useReducedMotion();
  const [range, setRange] = useState<DateRange>('last_7_days');
  const [activeTab, setActiveTab] = useState<TabId>('traffic');
  const [platform, setPlatform] = useState<PlatformAnalyticsOverview | null>(null);
  const [byUser, setByUser] = useState<AnalyticsByUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tenant Leaderboard Filter & Sort
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantSort, setTenantSort] = useState<'events' | 'visitors' | 'conversion'>('events');

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const [p, u] = await Promise.all([
        superadminService.getPlatformAnalytics(range),
        superadminService.getAnalyticsByUser(range, 50),
      ]);
      setPlatform(p);
      setByUser(u);
    } catch (e) {
      console.error(e);
      setError('Failed to load platform analytics telemetry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  // Export Analytics CSV
  const handleExportCsv = useCallback(() => {
    if (!platform || !byUser) return;
    const lines: string[] = [];
    lines.push(`Platform Analytics Report - Period: ${platform.range}`);
    lines.push(`Date Range,${platform.period.start} to ${platform.period.end}`);
    lines.push(`Unique Visitors,${platform.total_visitors}`);
    lines.push(`Gross Pageviews,${platform.total_views}`);
    lines.push(`Guest Clicks,${platform.total_clicks}`);
    lines.push(`Guest Searches,${platform.total_searches ?? 0}`);
    lines.push(`Gross Events,${platform.total_events}`);
    lines.push(`Conversions,${platform.total_conversions ?? 0}`);
    lines.push(`Conversion Rate,${platform.conversion_rate ?? 0}%`);
    lines.push('');

    // Tenant rankings
    lines.push('Tenant Performance Leaderboard');
    lines.push('User ID,Name,Business,Phone,Slug,Total Events,Unique Visitors,Visits,Clicks,Searches,Conversions,Conversion Rate %');
    byUser.tenants.forEach((t) => {
      lines.push(
        `"${t.user_id}","${t.name}","${t.business_name || ''}","${t.phone}","${t.public_slug || ''}",${t.total_events},${t.unique_visitors},${t.visits || 0},${t.clicks || 0},${t.searches || 0},${t.conversions || 0},"${t.conversion_rate || 0}%"`
      );
    });

    lines.push('');
    lines.push('Top Searches');
    lines.push('Keyword,Count');
    (platform.top_searches || []).forEach((s) => {
      lines.push(`"${s.query}",${s.count}`);
    });

    lines.push('');
    lines.push('Zero-Result Searches (Menu Gaps)');
    lines.push('Keyword,Count');
    (platform.zero_result_searches || []).forEach((s) => {
      lines.push(`"${s.query}",${s.count}`);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `platform-analytics-${platform.range}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [platform, byUser]);

  if (loading && !platform) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <PiArrowClockwiseBold className="size-8 animate-spin text-primary" />
        <p className="text-caption uppercase tracking-wider text-muted-foreground">Aggregating Global Telemetry…</p>
      </div>
    );
  }

  if (error || !platform || !byUser) {
    return (
      <div className="mx-auto max-w-2xl mt-20">
        <Card className="p-12 text-center flex flex-col items-center gap-6 border-destructive/20 bg-destructive/5">
          <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <PiWarningBold className="size-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-h1 text-foreground">Analytics Unavailable</h3>
            <p className="text-body text-muted-foreground">{error ?? 'An unexpected error occurred while fetching system data.'}</p>
          </div>
          <Button onClick={() => load()} leftIcon={<PiArrowClockwiseBold className="size-4" />}>
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="flex h-full flex-col gap-6 overflow-y-auto pr-2 pb-16"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Platform Analytics Suite"
          description="Cross-tenant intelligence, visitor behavior, menu demand gaps, conversion funnels, and infrastructure traffic patterns."
          eyebrow="Global Intelligence & Telemetry"
        />

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[170px]">
            <label htmlFor="analytics-range" className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Analysis Period
            </label>
            <Select
              id="analytics-range"
              value={range}
              onChange={(e) => setRange(e.target.value as DateRange)}
            >
              <option value="today">Today</option>
              <option value="24h">Last 24 Hours</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="all">All Time</option>
            </Select>
          </div>

          <Button
            variant="secondary"
            onClick={() => load(true)}
            leftIcon={<PiArrowClockwiseBold className={`size-4 ${refreshing ? 'animate-spin text-primary' : ''}`} />}
            disabled={refreshing}
            title="Refresh analytics data"
          >
            Refresh
          </Button>

          <Button
            variant="secondary"
            onClick={handleExportCsv}
            leftIcon={<PiDownloadSimpleBold className="size-4" />}
            title="Export CSV report"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Top Executive KPI Cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        variants={staggerContainer(0.04)}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <motion.div variants={fadeInUp}>
          <MetricCard
            title="Distinct Visitors"
            value={platform.total_visitors}
            sub="Unique guest devices"
            icon={<PiUsersBold className="size-5" />}
            highlight
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <MetricCard
            title="Menu & Landing Views"
            value={platform.total_views}
            sub="Guest browsing sessions"
            icon={<PiEyeBold className="size-5" />}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <MetricCard
            title="Guest Interactions"
            value={platform.total_clicks + (platform.total_searches ?? 0)}
            sub={`${platform.total_clicks.toLocaleString()} clicks · ${(platform.total_searches ?? 0).toLocaleString()} searches`}
            icon={<PiCursorClickBold className="size-5" />}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <MetricCard
            title="High-Intent Conversions"
            value={platform.total_conversions ?? 0}
            sub="WhatsApp, Reviews & Bills"
            badge={`${platform.conversion_rate ?? 0}% Rate`}
            badgeTone="success"
            icon={<PiTargetBold className="size-5" />}
            highlightTone="emerald"
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <MetricCard
            title="Active Restaurants"
            value={platform.active_tenants_count ?? byUser.tenants.length}
            sub="Generating traffic in period"
            icon={<PiStorefrontBold className="size-5" />}
          />
        </motion.div>
      </motion.div>

      {/* Sub Tabs Row */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <SubTabPills
          options={TAB_OPTIONS}
          active={activeTab}
          onChange={(tab) => setActiveTab(tab)}
        />
        <div className="hidden items-center gap-2 text-[11px] font-semibold text-muted-foreground md:flex">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time aggregate data</span>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'traffic' && <TrafficFunnelTab platform={platform} />}
      {activeTab === 'demand' && <SearchDemandTab platform={platform} />}
      {activeTab === 'dishes' && <TopDishesTab platform={platform} />}
      {activeTab === 'time_tech' && <PeakTimeTechTab platform={platform} />}
      {activeTab === 'tenants' && (
        <TenantLeaderboardTab
          byUser={byUser}
          tenantSearch={tenantSearch}
          onSearchChange={setTenantSearch}
          tenantSort={tenantSort}
          onSortChange={setTenantSort}
        />
      )}
    </motion.div>
  );
}
