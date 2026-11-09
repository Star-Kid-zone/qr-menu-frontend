'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardData } from '@/services/analytics.service';
import { formatHour } from '@/utils/dashboardInsights';

export function BusiestHoursCard({ data, loading }: { data: DashboardData | null; loading: boolean }) {
  const hours = data?.visitsByHour ?? [];
  const max = Math.max(...hours.map((h) => h.count), 0);
  const peak = max > 0 ? hours.reduce((a, b) => (b.count > a.count ? b : a)) : null;

  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border px-6 py-4">
        <CardTitle className="text-sm font-semibold text-foreground">Busiest hours</CardTitle>
        <p className="text-xs text-muted-foreground">
          {peak ? `Most guests visit around ${formatHour(peak.hour)}. Good time to post or staff up.` : 'When guests visit during the day'}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : !peak ? (
          <p className="text-xs text-muted-foreground">No visits yet.</p>
        ) : (
          <>
            <div className="flex h-32 items-end gap-1" role="img" aria-label={`Visits by hour. Busiest at ${formatHour(peak.hour)} with ${peak.count} visits.`}>
              {hours.map((h) => (
                <div key={h.hour} className="flex h-full flex-1 items-end" title={`${formatHour(h.hour)}: ${h.count} visits`}>
                  <div
                    className={h.hour === peak.hour ? 'w-full rounded-t bg-primary' : 'w-full rounded-t bg-primary/30'}
                    style={{ height: `${Math.max((h.count / max) * 100, h.count > 0 ? 4 : 1)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-caption text-muted-foreground" aria-hidden>
              {[0, 6, 12, 18, 23].map((h) => <span key={h}>{formatHour(h)}</span>)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
