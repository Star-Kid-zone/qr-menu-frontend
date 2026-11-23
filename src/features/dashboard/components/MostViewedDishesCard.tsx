'use client';

import Image from '@/components/ui/Image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PiForkKnifeBold } from 'react-icons/pi';
import type { DashboardData } from '@/services/analytics.service';

export function MostViewedDishesCard({ data, loading }: { data: DashboardData | null; loading: boolean }) {
  const items = data?.topMenuItems ?? [];
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <PiForkKnifeBold size={16} className="text-primary" aria-hidden />
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Most viewed dishes</CardTitle>
            <p className="text-xs text-muted-foreground">What guests look at and tap the most</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : items.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No dish views yet. Once guests open your menu, their favourites show up here.
          </p>
        ) : (
          <ol className="space-y-3">
            {items.map((it, i) => (
              <li key={it.menuItemId} className="flex items-center gap-3">
                <span className="w-4 text-caption font-semibold text-muted-foreground">{i + 1}</span>
                {it.imageUrl ? (
                  <Image src={it.imageUrl} alt="" width={40} height={40} unoptimized className="size-10 rounded-md object-cover" />
                ) : (
                  <Link
                    href="/admin/listmenu"
                    className="flex size-10 items-center justify-center rounded-md bg-muted text-caption text-muted-foreground hover:text-foreground"
                    title="Add a photo"
                  >
                    + Photo
                  </Link>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium text-foreground">{it.item}</span>
                    <span className="shrink-0 text-muted-foreground">{it.count} views</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(it.count / max) * 100}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
