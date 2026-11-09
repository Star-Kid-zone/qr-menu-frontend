'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { StatCardItem } from '../types';

export interface AdminDashboardKpisProps {
  statCards: StatCardItem[];
  loading: boolean;
}

export function AdminDashboardKpis({ statCards, loading }: AdminDashboardKpisProps) {
  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col justify-between rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold text-muted-foreground sm:text-xs">{stat.label}</span>
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
            {!loading && stat.delta ? (
              <p
                className={`mt-0.5 text-caption font-semibold ${stat.delta.pct > 0 ? 'text-success' : stat.delta.pct < 0 ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                <span aria-hidden>{stat.delta.pct > 0 ? '▲' : stat.delta.pct < 0 ? '▼' : '–'}</span>{' '}
                {stat.delta.pct === 0 ? 'No change' : `${Math.abs(stat.delta.pct)}%`}{' '}
                <span className="font-normal text-muted-foreground">{stat.delta.label}</span>
                <span className="sr-only">
                  {stat.delta.pct > 0 ? ' (up)' : stat.delta.pct < 0 ? ' (down)' : ''}
                </span>
              </p>
            ) : null}
            <p className="mt-0.5 text-caption font-medium text-muted-foreground">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
