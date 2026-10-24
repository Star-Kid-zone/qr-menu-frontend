'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardData } from '@/services/analytics.service';
import type { RangeKey } from '../types';

export interface TrafficTrendsCardProps {
  data: DashboardData | null;
  loading: boolean;
  rangeLabel: string;
  derived: {
    peakCount: number;
    peakDay: string;
    avgDailyVisits: number;
  };
}

export function TrafficTrendsCard({ data, loading, rangeLabel, derived }: TrafficTrendsCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Traffic Over Time</CardTitle>
            <p className="text-xs text-muted-foreground">{rangeLabel} · Daily guest visits</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Peak: {derived.peakCount} visits ({derived.peakDay})
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col p-5">
        {loading ? (
          <div className="flex h-48 items-end gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-32 flex-1 rounded-t-md" />
            ))}
          </div>
        ) : data?.visitHistory && data.visitHistory.length > 0 ? (
          <div>
            <div className="flex h-48 items-end gap-1.5 pt-6">
              {(() => {
                const maxCount = Math.max(...data.visitHistory.map((d) => d.count), 1);
                return data.visitHistory.map((val, i) => {
                  const heightPct = (val.count / maxCount) * 100;
                  return (
                    <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                      <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[10px] font-bold text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                        {val.count} visits · {val.date}
                      </span>
                      <div
                        className="w-full rounded-t bg-primary/75 transition-all duration-150 hover:bg-primary"
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                      <span className="mt-2 text-[9px] font-medium text-muted-foreground">
                        {new Date(val.date).toLocaleDateString(undefined, { weekday: 'narrow' })}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-2.5 text-[10px] font-medium text-muted-foreground">
              <span>{data.visitHistory[0]?.date}</span>
              <span>Average: <strong className="text-foreground">{derived.avgDailyVisits}</strong> visits/day</span>
              <span>{data.visitHistory[data.visitHistory.length - 1]?.date}</span>
            </div>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
            No visit history yet. Scan the QR code to record your first visit.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
