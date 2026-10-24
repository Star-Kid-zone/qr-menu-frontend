'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PiForkKnifeBold } from 'react-icons/pi';
import type { MenuStats } from '@/services/menu.service';

export interface MenuCatalogCardProps {
  menuStats: MenuStats | null;
  loading: boolean;
}

export function MenuCatalogCard({ menuStats, loading }: MenuCatalogCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <PiForkKnifeBold size={16} className="text-primary" />
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Menu Catalog Distribution</CardTitle>
            <p className="text-xs text-muted-foreground">Active inventory by dish category</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
          </div>
        ) : menuStats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                <p className="text-lg font-bold text-foreground">{menuStats.total}</p>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Total</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5 text-center dark:bg-emerald-950/40">
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{menuStats.available}</p>
                <p className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-500">Available</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2.5 text-center dark:bg-amber-950/40">
                <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{menuStats.popular}</p>
                <p className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-500">Popular</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {menuStats.byCategory.slice(0, 4).map((c) => {
                const pct = menuStats.total > 0 ? Math.round((c.count / menuStats.total) * 100) : 0;
                return (
                  <div key={c.category} className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{c.category}</span>
                      <span className="text-muted-foreground">{c.count} items ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No menu items configured.</p>
        )}
      </CardContent>
    </Card>
  );
}
