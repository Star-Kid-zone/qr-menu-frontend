'use client';
import { fillMissingDays, formatDate } from "@/utils/date";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardData } from '@/services/analytics.service';

export interface VisitorRetentionCardProps {
  data: DashboardData | null;
  loading: boolean;
}

export function VisitorRetentionCard({ data, loading }: VisitorRetentionCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">New and returning visitors</CardTitle>
            <p className="text-xs text-muted-foreground">People visiting for the first time, and people who came back</p>
          </div>
          {data?.visitorTrend && data.visitorTrend.length > 0 ? (
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-primary">
                <span className="size-2 rounded-full bg-primary" /> New
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="size-2 rounded-full bg-primary/30" /> Returning
              </span>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex h-40 items-end gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-28 flex-1 rounded-t-md" />
            ))}
          </div>
        ) : data?.visitorTrend && data.visitorTrend.length > 0 ? (
          <div>
            <div className="flex h-40 items-end gap-2 pt-6">
              {(() => {
                const series = fillMissingDays(data.visitorTrend, (date) => ({ date, newVisitors: 0, returningVisitors: 0 }));
                const maxTotal = Math.max(
                  ...series.map((d) => d.newVisitors + d.returningVisitors),
                  1,
                );
                return series.map((day, i) => {
                  const dayTotal = day.newVisitors + day.returningVisitors;
                  const heightPct = (dayTotal / maxTotal) * 100;
                  const newPct = dayTotal > 0 ? (day.newVisitors / dayTotal) * 100 : 0;
                  return (
                    <div key={i} title={`${day.newVisitors} new, ${day.returningVisitors} returning`} className="group relative flex h-full min-w-0 flex-1 basis-0 flex-col items-center justify-end">
                      <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-caption font-bold text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                        {day.newVisitors} new · {day.returningVisitors} returning
                      </span>
                      <div
                        className="flex w-full flex-col-reverse overflow-hidden rounded-t"
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      >
                        <div className="w-full bg-primary/30" style={{ height: `${100 - newPct}%` }} />
                        <div className="w-full bg-primary" style={{ height: `${newPct}%` }} />
                      </div>
                      <span className="mt-2 whitespace-nowrap text-caption font-medium text-muted-foreground">
                        {(series.length <= 10 || i % Math.ceil(series.length / 7) === 0) ? formatDate(day.date, { day: "numeric", month: "short" }) : "\u00a0"}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        ) : (
          <p className="py-10 text-center text-xs text-muted-foreground">
            No visitor data yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
