'use client';
import { fillMissingDays, formatDate } from "@/utils/date";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardData } from '@/services/analytics.service';

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
      <CardHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Visits per day</CardTitle>
            <p className="text-xs text-muted-foreground">{rangeLabel} · Each bar is one day</p>
          </div>
          {derived.peakCount > 0 ? (
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-caption font-bold text-success dark:bg-success dark:text-success">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              Peak: {derived.peakCount} visits ({derived.peakDay})
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col p-6">
        {loading ? (
          <div className="flex h-48 items-end gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-32 flex-1 rounded-t-md" />
            ))}
          </div>
        ) : data?.visitHistory && data.visitHistory.length > 0 ? (
          <div>
            <div className="flex h-48 items-end gap-2 pt-6">
              {(() => {
                const series = fillMissingDays(data.visitHistory, (date) => ({ date, count: 0 }));
                const maxCount = Math.max(...series.map((d) => d.count), 1);
                return series.map((val, i) => {
                  const heightPct = (val.count / maxCount) * 100;
                  return (
                    <div key={i} className="group relative flex h-full min-w-0 flex-1 basis-0 flex-col items-center justify-end">
                      <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-caption font-bold text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                        {val.count} visits · {formatDate(val.date)}
                      </span>
                      <div
                        className="w-full rounded-t bg-primary/75 transition-all duration-150 hover:bg-primary"
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                      <span className="mt-2 whitespace-nowrap text-caption font-medium text-muted-foreground">
                        {(series.length <= 10 || i % Math.ceil(series.length / 7) === 0) ? formatDate(val.date, { day: "numeric", month: "short" }) : "\u00a0"}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-caption font-medium text-muted-foreground">
              <span>{data.visitHistory[0] ? formatDate(data.visitHistory[0].date) : null}</span>
              <span>Average <strong className="text-foreground">{derived.avgDailyVisits}</strong> visits a day</span>
              <span>{data.visitHistory.length ? formatDate(data.visitHistory[data.visitHistory.length - 1].date) : null}</span>
            </div>
          </div>
        ) : (
          <p className="py-10 text-center text-xs text-muted-foreground">
            No visits in this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
