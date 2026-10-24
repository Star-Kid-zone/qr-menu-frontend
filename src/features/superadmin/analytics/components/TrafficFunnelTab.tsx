'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, Badge } from '@/components/ui';
import {
  PiFunnelBold,
  PiTargetBold,
  PiCheckCircleBold,
  PiCursorClickBold,
} from 'react-icons/pi';
import { DONUT_COLORS } from '../constants';
import { CustomTimelineTooltip, CustomPieTooltip } from './AnalyticsTooltips';
import type { TrafficFunnelTabProps } from '../types';

export function TrafficFunnelTab({ platform }: TrafficFunnelTabProps) {
  return (
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
  );
}
