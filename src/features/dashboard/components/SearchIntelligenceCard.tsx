'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import type { DashboardData } from '@/services/analytics.service';

export interface SearchIntelligenceCardProps {
  data: DashboardData | null;
  loading: boolean;
}

export function SearchIntelligenceCard({ data, loading }: SearchIntelligenceCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <PiMagnifyingGlassBold size={16} className="text-primary" />
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Search Intelligence</CardTitle>
            <p className="text-xs text-muted-foreground">What guests are searching for</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Top queries */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Top Queries</p>
              {data?.topSearches && data.topSearches.length > 0 ? (
                <ul className="space-y-1.5">
                  {data.topSearches.slice(0, 5).map((s, i) => (
                    <li key={`${s.query}-${i}`} className="flex items-center justify-between rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs">
                      <span className="truncate font-medium text-foreground">{s.query}</span>
                      <span className="text-muted-foreground">{s.count}×</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No searches yet.</p>
              )}
            </div>

            {/* Zero results */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">No Results Found</p>
              {data?.zeroResultSearches && data.zeroResultSearches.length > 0 ? (
                <ul className="space-y-1.5">
                  {data.zeroResultSearches.slice(0, 5).map((s, i) => (
                    <li key={`${s.query}-${i}`} className="flex items-center justify-between rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                      <span className="truncate font-medium">{s.query}</span>
                      <span>{s.count}×</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">All customer searches matched dishes!</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
