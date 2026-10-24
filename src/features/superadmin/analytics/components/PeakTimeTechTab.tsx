'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card, Badge } from '@/components/ui';
import {
  PiClockBold,
  PiCalendarBlankBold,
  PiDeviceMobileBold,
  PiDeviceTabletBold,
  PiDesktopBold,
} from 'react-icons/pi';
import type { PeakTimeTechTabProps } from '../types';

export function PeakTimeTechTab({ platform }: PeakTimeTechTabProps) {
  return (
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
  );
}
