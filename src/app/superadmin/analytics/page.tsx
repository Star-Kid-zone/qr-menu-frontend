'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  superadminService,
  type DateRange,
  type PlatformAnalyticsOverview,
  type AnalyticsByUserResponse,
} from '@/services/superadmin.service';
import { routes } from '@/config/routes';
import { PageHeader, Card, Button, Select, Badge, SubTabPills } from '@/components/ui';
import {
  PiUsersBold,
  PiCursorClickBold,
  PiWarningBold,
  PiArrowClockwiseBold,
  PiDownloadSimpleBold,
  PiStorefrontBold,
  PiDeviceMobileBold,
  PiDesktopBold,
  PiDeviceTabletBold,
  PiForkKnifeBold,
  PiClockBold,
  PiCalendarBlankBold,
  PiFunnelBold,
  PiTargetBold,
  PiEyeBold,
  PiArrowSquareOutBold,
  PiMagnifyingGlassBold,
  PiSparkleBold,
  PiCheckCircleBold,
} from 'react-icons/pi';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';

type TabId = 'traffic' | 'demand' | 'dishes' | 'time_tech' | 'tenants';

const TAB_OPTIONS: Array<{ id: TabId; label: string }> = [
  { id: 'traffic', label: 'Traffic & Funnel' },
  { id: 'demand', label: 'Search & Demand Gaps' },
  { id: 'dishes', label: 'Top Dishes' },
  { id: 'time_tech', label: 'Peak Times & Tech' },
  { id: 'tenants', label: 'Tenant Leaderboard' },
];

const DONUT_COLORS = [
  '#06b6d4', // Teal/Cyan
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#6366f1', // Indigo
];

export default function SuperadminAnalyticsPage() {
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

  // Filtered & sorted tenants
  const filteredTenants = useMemo(() => {
    if (!byUser?.tenants) return [];
    let list = byUser.tenants.filter((t) => {
      if (!tenantSearch.trim()) return true;
      const q = tenantSearch.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        (t.business_name && t.business_name.toLowerCase().includes(q)) ||
        t.phone.includes(q) ||
        (t.public_slug && t.public_slug.toLowerCase().includes(q))
      );
    });

    if (tenantSort === 'visitors') {
      list.sort((a, b) => b.unique_visitors - a.unique_visitors);
    } else if (tenantSort === 'conversion') {
      list.sort((a, b) => (b.conversion_rate || 0) - (a.conversion_rate || 0));
    } else {
      list.sort((a, b) => b.total_events - a.total_events);
    }

    return list;
  }, [byUser, tenantSearch, tenantSort]);

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

      {/* TAB CONTENT 1: TRAFFIC & FUNNEL */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          {/* Main Area Timeline Chart */}
          <Card className="flex flex-col p-6">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-h2 text-foreground">Visitors & Interaction Volume</h2>
                <p className="text-caption text-muted-foreground">
                  Comparison between unique guest devices and gross event interactions across all restaurants
                </p>
              </div>
              <div className="flex items-center gap-4 text-caption font-semibold">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-cyan-500" />
                  <span className="text-foreground">Visitors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-violet-500" />
                  <span className="text-foreground">Total Events</span>
                </div>
              </div>
            </div>

            <div className="h-80 w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={platform.visitors_over_time} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.6} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTimelineTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="events"
                    name="Gross Events"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEvents)"
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Unique Visitors"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Funnel & Conversion Action Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Conversion Funnel */}
            <Card className="flex flex-col p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <PiFunnelBold className="size-5 text-primary" />
                  <h2 className="text-h2 text-foreground">Platform Conversion Funnel</h2>
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  Guest journey progression from initial QR scan to high-intent restaurant conversion
                </p>
              </div>

              <div className="mt-2 flex flex-col justify-between gap-4 flex-1">
                {(platform.funnel || [
                  { step: 'Scans & Visitors', count: platform.total_visitors, dropoffPct: 0 },
                  { step: 'Menu Sessions', count: platform.total_views, dropoffPct: 0 },
                  { step: 'Dish Clicks & Searches', count: platform.total_clicks + (platform.total_searches ?? 0), dropoffPct: 0 },
                  { step: 'High-Intent Conversions', count: platform.total_conversions ?? 0, dropoffPct: 0 },
                ]).map((step, idx) => {
                  const maxCount = Math.max(1, platform.total_visitors || platform.total_events);
                  const widthPct = Math.min(100, Math.max(8, Math.round((step.count / maxCount) * 100)));
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-body">
                        <div className="flex items-center gap-2">
                          <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-foreground">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-foreground">{step.step}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground">{step.count.toLocaleString()}</span>
                          {idx > 0 && step.dropoffPct > 0 && (
                            <span className="text-[10px] font-semibold text-destructive">
                              -{step.dropoffPct}% drop
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx === 3 ? 'bg-emerald-500' : idx === 2 ? 'bg-amber-500' : idx === 1 ? 'bg-violet-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PiTargetBold className="size-4 text-emerald-500" />
                    <span className="text-body font-semibold text-foreground">Overall Platform Conversion Rate</span>
                  </div>
                  <Badge tone="success" className="text-body px-3 py-1 font-mono">
                    {platform.conversion_rate ?? 0}%
                  </Badge>
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  Percentage of unique visitors that trigger a WhatsApp inquiry, Google review tap, bill payment, or phone call.
                </p>
              </div>
            </Card>

            {/* Action & Conversion Targets Breakdown */}
            <Card className="flex flex-col p-6">
              <div className="mb-4">
                <h2 className="text-h2 text-foreground">Action Distribution & High-Intent Targets</h2>
                <p className="mt-1 text-caption text-muted-foreground">
                  Breakdown of customer actions across landing pages and interactive menus
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Donut Chart */}
                <div className="flex flex-col items-center justify-center">
                  <div className="h-48 w-48 relative">
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <Pie
                          data={platform.action_distribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                        >
                          {platform.action_distribution.map((_, i) => (
                            <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Total</span>
                      <span className="font-mono text-h2 font-bold text-foreground">
                        {platform.total_events.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap justify-center gap-3">
                    {platform.action_distribution.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{item.name}:</span>
                        <span className="font-mono font-bold text-foreground">{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion Target List */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Conversion Destinations
                  </p>
                  {(platform.click_targets && platform.click_targets.length > 0) ? (
                    platform.click_targets.slice(0, 5).map((target, idx) => (
                      <div key={idx} className="rounded-lg border border-border p-2.5 bg-card hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between text-caption font-semibold">
                          <div className="flex items-center gap-2">
                            {target.isConversion ? (
                              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                                <PiCheckCircleBold className="size-3.5" />
                              </span>
                            ) : (
                              <span className="flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <PiCursorClickBold className="size-3" />
                              </span>
                            )}
                            <span className="text-foreground">{target.label}</span>
                          </div>
                          <span className="font-mono font-bold text-foreground">{target.count.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-32 flex-col items-center justify-center text-center text-caption text-muted-foreground border border-dashed border-border rounded-lg">
                      <PiCursorClickBold className="size-6 mb-1 opacity-50" />
                      <span>No conversion clicks recorded in this period.</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: SEARCH & DEMAND GAPS */}
      {activeTab === 'demand' && (
        <div className="space-y-6">
          {/* Opportunity Banner */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                <PiSparkleBold className="size-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-h2 font-bold text-foreground">Menu Demand Gap Intelligence</h3>
                  <Badge tone="warning">High Commercial Value</Badge>
                </div>
                <p className="text-body text-muted-foreground">
                  Zero-result searches reveal dishes and drinks that guests actively searched for but could not find on restaurant menus.
                  Superadmins can share these insights with restaurant owners to expand their menus and satisfy unmet customer demand.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Searches */}
            <Card className="flex flex-col p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-h2 text-foreground">Top Guest Searches</h2>
                  <p className="text-caption text-muted-foreground">Most frequent search terms entered across all menus</p>
                </div>
                <Badge tone="primary">{(platform.top_searches || []).length} Queries</Badge>
              </div>

              {(platform.top_searches && platform.top_searches.length > 0) ? (
                <div className="space-y-3">
                  {platform.top_searches.map((s, idx) => {
                    const topCount = platform.top_searches?.[0]?.count || 1;
                    const pct = Math.round((s.count / topCount) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-body">
                          <div className="flex items-center gap-2">
                            <span className="flex size-5 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
                              #{idx + 1}
                            </span>
                            <span className="font-semibold text-foreground capitalize">“{s.query}”</span>
                          </div>
                          <span className="font-mono font-bold text-foreground">{s.count.toLocaleString()} searches</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                          <div className="h-full rounded-full bg-cyan-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-1 min-h-[220px] flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
                  <PiMagnifyingGlassBold className="size-8 text-muted-foreground mb-2" />
                  <p className="text-body font-semibold text-foreground">No searches recorded</p>
                  <p className="text-caption text-muted-foreground max-w-sm mt-1">
                    Guests have not performed menu searches during the selected period.
                  </p>
                </div>
              )}
            </Card>

            {/* Zero Result Searches (Menu Gaps) */}
            <Card className="flex flex-col p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-h2 text-foreground">Unmet Demand (Zero-Results)</h2>
                  <p className="text-caption text-muted-foreground">Searches that returned 0 dishes across menus</p>
                </div>
                <Badge tone="warning">Menu Gaps</Badge>
              </div>

              {(platform.zero_result_searches && platform.zero_result_searches.length > 0) ? (
                <div className="space-y-3">
                  {platform.zero_result_searches.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500 font-bold text-caption">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-foreground capitalize">“{s.query}”</p>
                          <p className="text-[10px] text-muted-foreground">0 matches in catalog</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-foreground">{s.count.toLocaleString()}</span>
                        <span className="block text-[10px] text-amber-500 font-semibold">Missed orders</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 min-h-[220px] flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
                  <PiSparkleBold className="size-8 text-emerald-500 mb-2" />
                  <p className="text-body font-semibold text-foreground">No menu gaps detected</p>
                  <p className="text-caption text-muted-foreground max-w-sm mt-1">
                    Guests are finding matching items for all searches in the selected period!
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: TOP DISHES */}
      {activeTab === 'dishes' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-h2 text-foreground">Cross-Tenant Dish Popularity Leaderboard</h2>
                <p className="text-caption text-muted-foreground">
                  Most viewed and clicked dishes across all restaurant menus on the platform
                </p>
              </div>
              <Badge tone="primary">Top {(platform.top_dishes || []).length} Items</Badge>
            </div>

            {(platform.top_dishes && platform.top_dishes.length > 0) ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {platform.top_dishes.map((dish, idx) => (
                  <div
                    key={idx}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg"
                  >
                    <div>
                      <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl bg-muted">
                        {dish.imageUrl ? (
                          <Image
                            src={dish.imageUrl}
                            alt={dish.item}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                            <PiForkKnifeBold className="size-10 opacity-30" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-0.5 backdrop-blur-md">
                          <span className="text-[10px] font-bold text-primary">#{idx + 1}</span>
                        </div>
                        {dish.type && (
                          <div className="absolute top-2 right-2">
                            <Badge
                              tone={dish.type.toLowerCase().includes('non') ? 'danger' : 'success'}
                              className="text-[9px]"
                            >
                              {dish.type}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <h3 className="line-clamp-1 font-bold text-foreground text-body" title={dish.item}>
                        {dish.item}
                      </h3>
                      <p className="mt-0.5 text-caption text-muted-foreground line-clamp-1">
                        {dish.restaurantName}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Price</span>
                        <p className="font-mono font-bold text-foreground">₹{dish.price}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Interactions</span>
                        <p className="font-mono font-bold text-primary">{dish.count.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl">
                <PiForkKnifeBold className="size-10 text-muted-foreground mb-3 opacity-40" />
                <p className="text-body font-semibold text-foreground">No dish interaction data yet</p>
                <p className="text-caption text-muted-foreground max-w-md mt-1">
                  Once guests click on dish cards, open details, or view menu items, the most popular dishes will appear here.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB CONTENT 4: PEAK TIMES & TECH */}
      {activeTab === 'time_tech' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 24-Hour Peak Traffic */}
            <Card className="flex flex-col p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <PiClockBold className="size-5 text-primary" />
                  <h2 className="text-h2 text-foreground">24-Hour Peak Traffic Rhythm</h2>
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  Hourly breakdown showing peak scan times (Lunch rush 12-3 PM & Dinner rush 7-10 PM)
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={platform.hourly_distribution || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.6} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                      interval={2}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.75rem',
                        fontWeight: 700,
                      }}
                    />
                    <Bar dataKey="events" name="Total Events" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Day of Week Activity */}
            <Card className="flex flex-col p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <PiCalendarBlankBold className="size-5 text-violet-500" />
                  <h2 className="text-h2 text-foreground">Day-of-Week Distribution</h2>
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  Weekly dining & traffic patterns comparing weekdays to weekends
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={platform.weekday_distribution || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.6} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.75rem',
                        fontWeight: 700,
                      }}
                    />
                    <Bar dataKey="count" name="Interactions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Device & OS Intelligence */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Device Types */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-h2 text-foreground">Device Breakdown</h2>
                  <p className="text-caption text-muted-foreground">Mobile vs Desktop vs Tablet guest scans</p>
                </div>
                <Badge tone="primary">Client Technology</Badge>
              </div>

              <div className="space-y-4">
                {(platform.devices?.device_types && platform.devices.device_types.length > 0) ? (
                  platform.devices.device_types.map((d, idx) => {
                    const totalDev = platform.devices?.device_types?.reduce((acc, curr) => acc + curr.value, 0) || 1;
                    const pct = Math.round((d.value / totalDev) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-body">
                          <div className="flex items-center gap-2">
                            {d.name === 'Mobile' ? (
                              <PiDeviceMobileBold className="size-4 text-cyan-500" />
                            ) : d.name === 'Tablet' ? (
                              <PiDeviceTabletBold className="size-4 text-amber-500" />
                            ) : (
                              <PiDesktopBold className="size-4 text-violet-500" />
                            )}
                            <span className="font-semibold text-foreground">{d.name}</span>
                          </div>
                          <span className="font-mono text-muted-foreground">
                            {d.value.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-muted/50 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              d.name === 'Mobile' ? 'bg-cyan-500' : d.name === 'Tablet' ? 'bg-amber-500' : 'bg-violet-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-caption text-muted-foreground">No device telemetry recorded yet.</p>
                )}
              </div>
            </Card>

            {/* Operating Systems */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-h2 text-foreground">Operating Systems</h2>
                  <p className="text-caption text-muted-foreground">Guest OS distribution (iOS, Android, Windows)</p>
                </div>
                <Badge tone="primary">OS Telemetry</Badge>
              </div>

              <div className="space-y-4">
                {(platform.devices?.os && platform.devices.os.length > 0) ? (
                  platform.devices.os.map((o, idx) => {
                    const totalOS = platform.devices?.os?.reduce((acc, curr) => acc + curr.value, 0) || 1;
                    const pct = Math.round((o.value / totalOS) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-body">
                          <span className="font-semibold text-foreground">{o.name}</span>
                          <span className="font-mono text-muted-foreground">
                            {o.value.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-muted/50 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-caption text-muted-foreground">No OS telemetry recorded yet.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: TENANT LEADERBOARD */}
      {activeTab === 'tenants' && (
        <Card className="overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-h2 text-foreground">Tenant Performance Leaderboard</h2>
              <p className="mt-0.5 text-caption uppercase tracking-wide text-muted-foreground">
                Ranked activity, unique visitors, and conversion metrics per restaurant workspace
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px]">
                <PiMagnifyingGlassBold className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter restaurant or owner…"
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-caption text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <Select
                value={tenantSort}
                onChange={(e) => setTenantSort(e.target.value as any)}
                className="w-44"
              >
                <option value="events">Sort: Total Events</option>
                <option value="visitors">Sort: Unique Visitors</option>
                <option value="conversion">Sort: Conversion Rate</option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-body">
              <thead className="border-b border-border bg-muted/20">
                <tr>
                  <th className="px-6 py-3.5 text-caption uppercase tracking-wide text-muted-foreground">Restaurant / Owner</th>
                  <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Unique Visitors</th>
                  <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Gross Events</th>
                  <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Conversions</th>
                  <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Conv. Rate</th>
                  <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTenants.map((t, idx) => (
                  <tr key={t.user_id} className="group transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold text-foreground">
                          {idx + 1}
                        </span>
                        <div className="flex flex-col">
                          <Link
                            href={routes.superadmin.userDetail(t.user_id)}
                            className="font-semibold text-primary transition-all hover:underline"
                          >
                            {t.business_name || t.name}
                          </Link>
                          <div className="flex items-center gap-2 text-caption text-muted-foreground">
                            <span>{t.name}</span>
                            <span>·</span>
                            <span className="font-mono">{t.phone}</span>
                            {t.public_slug && (
                              <>
                                <span>·</span>
                                <span className="rounded bg-muted/60 px-1.5 py-0.2 font-mono text-[10px] text-foreground">
                                  /{t.public_slug}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="tabular-figures font-mono font-semibold text-foreground">
                        {t.unique_visitors.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="tabular-figures font-mono font-bold text-foreground">
                          {t.total_events.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {t.visits || 0} visits · {t.clicks || 0} clicks
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="tabular-figures font-mono font-semibold text-emerald-500">
                        {(t.conversions || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Badge
                        tone={(t.conversion_rate || 0) > 15 ? 'success' : (t.conversion_rate || 0) > 5 ? 'warning' : 'neutral'}
                        className="font-mono text-[10px]"
                      >
                        {t.conversion_rate || 0}%
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link href={routes.superadmin.userDetail(t.user_id)}>
                        <Button variant="secondary" size="sm" rightIcon={<PiArrowSquareOutBold className="size-3.5" />}>
                          Inspect
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredTenants.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-body text-muted-foreground">
                      No matching tenant activity found for the selected filter and period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
}

// ─── Micro Components ────────────────────────────────────────────────────────

function MetricCard({
  title,
  value,
  sub,
  badge,
  badgeTone = 'neutral',
  icon,
  highlight = false,
  highlightTone = 'cyan',
}: {
  title: string;
  value: number;
  sub?: string;
  badge?: string;
  badgeTone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  icon: React.ReactNode;
  highlight?: boolean;
  highlightTone?: 'cyan' | 'emerald';
}) {
  return (
    <Card className="flex h-full flex-col justify-between p-5 transition-colors hover:border-primary/30">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div
            className={`flex size-9 items-center justify-center rounded-lg ${
              highlight
                ? highlightTone === 'emerald'
                  ? 'bg-emerald-500/15 text-emerald-500'
                  : 'bg-primary/15 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {icon}
          </div>
          {badge && <Badge tone={badgeTone}>{badge}</Badge>}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      </div>

      <div className="mt-3">
        <p className="tabular-figures text-display font-extrabold text-foreground">{value.toLocaleString()}</p>
        {sub && <p className="mt-1 text-caption text-muted-foreground">{sub}</p>}
      </div>
    </Card>
  );
}

function CustomTimelineTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-caption">
        <p className="font-bold text-foreground mb-1.5 border-b border-border pb-1">{data?.date || label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-cyan-500 font-semibold">
              <span className="size-2 rounded-full bg-cyan-500" /> Unique Visitors:
            </span>
            <span className="font-mono font-bold text-foreground">{data?.visitors?.toLocaleString() ?? 0}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-violet-500 font-semibold">
              <span className="size-2 rounded-full bg-violet-500" /> Gross Events:
            </span>
            <span className="font-mono font-bold text-foreground">{data?.events?.toLocaleString() ?? 0}</span>
          </div>
          {data?.clicks !== undefined && (
            <div className="flex items-center justify-between gap-4 text-muted-foreground text-[10px] pt-1 border-t border-border/50">
              <span>Clicks: {data?.clicks ?? 0}</span>
              <span>Searches: {data?.searches ?? 0}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-border bg-card p-2.5 shadow-xl text-caption font-bold">
        <span className="text-muted-foreground">{data.name}: </span>
        <span className="text-foreground font-mono">{data.value.toLocaleString()}</span>
      </div>
    );
  }
  return null;
}
