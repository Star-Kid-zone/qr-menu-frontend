'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { StatCardItem } from '../types';

export interface AdminDashboardKpisProps {
  statCards: StatCardItem[];
  loading: boolean;
}

export function AdminDashboardKpis({ statCards, loading }: AdminDashboardKpisProps) {
  return (
    <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col justify-between rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground sm:text-xs">{stat.label}</span>
            <div className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
          <div className="mt-2">
            {loading ? (
              <Skeleton className="h-6 w-16 sm:h-7 sm:w-20" />
            ) : (
              <p className="text-xl sm:text-2xl font-bold tabular-figures text-foreground">{stat.value}</p>
            )}
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
