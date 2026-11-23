'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardData } from '@/services/analytics.service';
import { ANALYTICS_TAP_LABELS } from '@/constants/analytics.constants';

const tapLabels: Record<string, string> = ANALYTICS_TAP_LABELS;

function sourceLabel(source: string): string {
  if (source === 'direct') return 'QR scan or direct link';
  return source.charAt(0).toUpperCase() + source.slice(1);
}

function Bars({ rows }: { rows: Array<{ label: string; count: number }> }) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="space-y-0.5">
          <div className="flex min-w-0 items-center justify-between gap-2 text-xs">
            <span className="min-w-0 truncate font-medium text-foreground">{r.label}</span>
            <span className="shrink-0 text-muted-foreground">{r.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TrafficSourcesCard({ data, loading }: { data: DashboardData | null; loading: boolean }) {
  const sources = (data?.acquisition ?? []).slice(0, 5).map((a) => ({ label: sourceLabel(a.source), count: a.count }));
  const taps = Object.entries(data?.clickBreakdown ?? {})
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ label: tapLabels[k] ?? k.replace(/_/g, ' '), count: v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border px-6 py-4">
        <CardTitle className="text-sm font-semibold text-foreground">How guests find you and what they tap</CardTitle>
        <p className="text-xs text-muted-foreground">Where visits come from, and which buttons get used</p>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-caption font-bold text-muted-foreground">Where visits come from</p>
              {sources.length ? <Bars rows={sources} /> : <p className="text-xs text-muted-foreground">No visits yet.</p>}
            </div>
            <div>
              <p className="mb-2 text-caption font-bold text-muted-foreground">Buttons guests tap</p>
              {taps.length ? <Bars rows={taps} /> : <p className="text-xs text-muted-foreground">No taps yet.</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
