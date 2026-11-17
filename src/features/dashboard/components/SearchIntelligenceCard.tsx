'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import type { DashboardData } from '@/services/analytics.service';

export interface SearchIntelligenceCardProps {
  data: DashboardData | null;
  loading: boolean;
}

export function SearchIntelligenceCard({ data, loading }: SearchIntelligenceCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <PiMagnifyingGlassBold size={16} className="text-primary" />
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">What guests searched for</CardTitle>
            <p className="text-xs text-muted-foreground">Searches on your menu page</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Top queries */}
            <div>
              <p className="mb-2 text-caption font-bold text-muted-foreground">Most searched</p>
              {data?.topSearches && data.topSearches.length > 0 ? (
                <ul className="space-y-2">
                  {data.topSearches.slice(0, 5).map((s, i) => (
                    <li key={`${s.query}-${i}`} className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs">
                      <span className="min-w-0 truncate font-medium text-foreground">{s.query}</span>
                      <span className="shrink-0 text-muted-foreground">{s.count}×</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No searches yet. When guests search your menu, their top searches show here.</p>
              )}
            </div>

            {/* Zero results */}
            <div>
              <p className="mb-2 text-caption font-bold text-muted-foreground">Searches with no matching dish</p>
              {data?.zeroResultSearches && data.zeroResultSearches.length > 0 ? (
                <ul className="space-y-2">
                  {data.zeroResultSearches.slice(0, 5).map((s, i) => (
                    <li key={`${s.query}-${i}`} className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning-foreground dark:bg-warning/40 dark:text-warning">
                      <span className="min-w-0 truncate font-medium">{s.query}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        {s.count}×
                        <Link href={`/admin/addmenu?name=${encodeURIComponent(s.query)}`} className="font-semibold underline">
                          Add this dish
                        </Link>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">None. Every search found a dish.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
