'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, Select, Button, Badge } from '@/components/ui';
import { routes } from '@/config/routes';
import { PiMagnifyingGlassBold, PiArrowSquareOutBold } from 'react-icons/pi';
import type { TenantLeaderboardTabProps } from '../types';

export function TenantLeaderboardTab({
  byUser,
  tenantSearch,
  onSearchChange,
  tenantSort,
  onSortChange,
}: TenantLeaderboardTabProps) {
  const filteredTenants = useMemo(() => {
    if (!byUser?.tenants) return [];
    const list = byUser.tenants.filter((t) => {
      if (!tenantSearch.trim()) return true;
      const q = tenantSearch.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        (t.business_name && t.business_name.toLowerCase().includes(q)) ||
        t.phone.includes(q) ||
        (t.public_slug && t.public_slug.toLowerCase().includes(q))
      );
    });

    if (tenantSort === 'visitors') {
      list.sort((a, b) => b.unique_visitors - a.unique_visitors);
    } else if (tenantSort === 'conversion') {
      list.sort((a, b) => (b.conversion_rate || 0) - (a.conversion_rate || 0));
    } else {
      list.sort((a, b) => b.total_events - a.total_events);
    }

    return list;
  }, [byUser, tenantSearch, tenantSort]);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2 text-foreground">Tenant Performance Leaderboard</h2>
          <p className="mt-0.5 text-caption uppercase tracking-wide text-muted-foreground">
            Ranked activity, unique visitors, and conversion metrics per restaurant workspace
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <PiMagnifyingGlassBold className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter restaurant or owner…"
              value={tenantSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-caption text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <Select
            value={tenantSort}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="w-44"
          >
            <option value="events">Sort: Total Events</option>
            <option value="visitors">Sort: Unique Visitors</option>
            <option value="conversion">Sort: Conversion Rate</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-body">
          <thead className="border-b border-border bg-muted/20">
            <tr>
              <th className="px-6 py-3.5 text-caption uppercase tracking-wide text-muted-foreground">Restaurant / Owner</th>
              <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Unique Visitors</th>
              <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Gross Events</th>
              <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Conversions</th>
              <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Conv. Rate</th>
              <th className="px-6 py-3.5 text-right text-caption uppercase tracking-wide text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTenants.map((t, idx) => (
              <tr key={t.user_id} className="group transition-colors hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold text-foreground">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <Link
                        href={routes.superadmin.userDetail(t.user_id)}
                        className="font-semibold text-primary transition-all hover:underline"
                      >
                        {t.business_name || t.name}
                      </Link>
                      <div className="flex items-center gap-2 text-caption text-muted-foreground">
                        <span>{t.name}</span>
                        <span>·</span>
                        <span className="font-mono">{t.phone}</span>
                        {t.public_slug && (
                          <>
                            <span>·</span>
                            <span className="rounded bg-muted/60 px-1.5 py-0.2 font-mono text-[10px] text-foreground">
                              /{t.public_slug}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="tabular-figures font-mono font-semibold text-foreground">
                    {t.unique_visitors.toLocaleString()}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="tabular-figures font-mono font-bold text-foreground">
                      {t.total_events.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {t.visits || 0} visits · {t.clicks || 0} clicks
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="tabular-figures font-mono font-semibold text-emerald-500">
                    {(t.conversions || 0).toLocaleString()}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <Badge
                    tone={(t.conversion_rate || 0) > 15 ? 'success' : (t.conversion_rate || 0) > 5 ? 'warning' : 'neutral'}
                    className="font-mono text-[10px]"
                  >
                    {t.conversion_rate || 0}%
                  </Badge>
                </td>

                <td className="px-6 py-4 text-right">
                  <Link href={routes.superadmin.userDetail(t.user_id)}>
                    <Button variant="secondary" size="sm" rightIcon={<PiArrowSquareOutBold className="size-3.5" />}>
                      Inspect
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}

            {filteredTenants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-body text-muted-foreground">
                  No matching tenant activity found for the selected filter and period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
