'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
import { PageLoader, PageHeader, Card, Button, Select } from '@/components/ui';
import { SUSPENSE_LABELS } from '@/config/app.constants';
import { PiChartLineUpBold, PiUsersBold, PiCursorClickBold, PiWarningBold, PiArrowClockwiseBold } from 'react-icons/pi';
import { PIE_COLORS } from "@/constants/app/superadmin/analytics/page.constants";
import { fadeIn } from '@/lib/motion';

export default function SuperadminAnalyticsPage() {
  const reduceMotion = useReducedMotion();
  const [range, setRange] = useState<DateRange>('last_7_days');
  const [platform, setPlatform] = useState<PlatformAnalyticsOverview | null>(null);
  const [byUser, setByUser] = useState<AnalyticsByUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, u] = await Promise.all([
        superadminService.getPlatformAnalytics(range),
        superadminService.getAnalyticsByUser(range, 30),
      ]);
      setPlatform(p);
      setByUser(u);
    } catch (e) {
      console.error(e);
      setError('Failed to load platform analytics.');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <PageLoader label={SUSPENSE_LABELS.charts} />
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
          <Button
            onClick={load}
            leftIcon={<PiArrowClockwiseBold className="size-4" />}
          >
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="flex h-full flex-col gap-4"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="Platform Analytics"
          description="Aggregate visibility across all system tenants and workspaces."
          eyebrow="Global Intelligence"
        />
        <div className="min-w-[180px]">
          <label htmlFor="analytics-range" className="mb-2 ml-1 block text-caption uppercase tracking-wide text-muted-foreground">
            Analysis Period
          </label>
          <Select
            id="analytics-range"
            value={range}
            onChange={(e) => setRange(e.target.value as DateRange)}
          >
            <option value="today">Today</option>
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
          </Select>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <MetricCard title="Distinct Visitors" value={platform.total_visitors} icon={<PiUsersBold className="size-5" />} highlight />
        <MetricCard title="Visit Events" value={platform.total_views} icon={<PiChartLineUpBold className="size-5" />} />
        <MetricCard title="Click Events" value={platform.total_clicks} icon={<PiCursorClickBold className="size-5" />} />
        <MetricCard title="Gross Events" value={platform.total_events} icon={<PiChartLineUpBold className="size-5" />} />
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <Card className="flex flex-col p-6">
          <div className="mb-4 flex shrink-0 items-center justify-between">
            <h2 className="text-h2 text-foreground">Visitors over time</h2>
          </div>
          <div className="h-72 w-full min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={platform.visitors_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 700,
                    boxShadow: '3px 3px 7px var(--neu-dark), -3px -3px 7px var(--neu-light)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="hsl(var(--primary))"
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col p-6">
          <div className="mb-4 flex shrink-0 items-center justify-between">
            <h2 className="text-h2 text-foreground">Action Distribution</h2>
          </div>
          {platform.action_distribution.length === 0 ? (
            <div className="flex h-72 flex-1 items-center justify-center text-body text-muted-foreground">
              No events recorded for this period.
            </div>
          ) : (
            <div className="h-72 w-full min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platform.action_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {platform.action_distribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius-lg)',
                      fontWeight: 700,
                      boxShadow: '3px 3px 7px var(--neu-dark), -3px -3px 7px var(--neu-light)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <Card className="shrink-0 overflow-hidden">
        <div className="border-b border-border bg-muted/40 px-6 py-4">
          <h2 className="text-h2 text-foreground">Top Tenants by Activity</h2>
          <p className="mt-1 text-caption uppercase tracking-wide text-muted-foreground">Ranking for selected period</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-body">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-6 py-4 text-caption uppercase tracking-wide text-muted-foreground">Tenant / Owner</th>
                <th className="px-6 py-4 text-right text-caption uppercase tracking-wide text-muted-foreground">Total Events</th>
                <th className="px-6 py-4 text-right text-caption uppercase tracking-wide text-muted-foreground">Unique Visitors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {byUser.tenants.map((t) => (
                <tr key={t.user_id} className="group transition-colors hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link
                        href={routes.superadmin.userDetail(t.user_id)}
                        className="font-semibold text-primary transition-all hover:underline"
                      >
                        {t.name}
                      </Link>
                      <span className="mt-0.5 font-mono text-caption text-muted-foreground">{t.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="tabular-figures font-mono font-semibold text-foreground">{t.total_events.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="tabular-figures font-mono font-semibold text-foreground">{t.unique_visitors.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
              {byUser.tenants.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-body text-muted-foreground">
                    No tenant activity found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

function MetricCard({ title, value, icon, highlight = false }: { title: string; value: number; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex size-9 items-center justify-center rounded-lg ${highlight ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
          {icon}
        </div>
        <p className="text-caption uppercase tracking-wide text-muted-foreground">{title}</p>
      </div>
      <p className="tabular-figures text-display text-foreground">
        {value.toLocaleString()}
      </p>
    </Card>
  );
}
