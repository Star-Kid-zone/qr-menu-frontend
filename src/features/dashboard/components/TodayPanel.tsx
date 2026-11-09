'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';
import { checklistService, type TodayChecklistRun } from '@/services/checklist.service';
import { socialService, type SocialAccount } from '@/services/social.service';
import type { DashboardData } from '@/services/analytics.service';
import type { MenuStats } from '@/services/menu.service';
import { buildInsights } from '@/utils/dashboardInsights';

/** "Today" strip plus tips and operations items. Every secondary fetch is non-blocking. */
export function TodayPanel({ data, menuStats }: { data: DashboardData | null; menuStats: MenuStats | null }) {
  const { hasPermission } = usePermissions();
  const [runs, setRuns] = useState<TodayChecklistRun[] | null>(null);
  const [accounts, setAccounts] = useState<SocialAccount[] | null>(null);
  const canOps = hasPermission('operations');
  const canMarketing = hasPermission('marketing');

  useEffect(() => {
    let mounted = true;
    if (canOps) {
      checklistService.today().then((r) => { if (mounted) setRuns(r.data.runs); }).catch(() => undefined);
    }
    if (canMarketing) {
      socialService.getAccounts().then((r) => { if (mounted) setAccounts(r.data); }).catch(() => undefined);
    }
    return () => { mounted = false; };
  }, [canOps, canMarketing]);

  const openRuns = runs?.filter((r) => r.run.status !== 'completed') ?? [];
  const brokenAccounts = accounts?.filter((a) => a.status !== 'connected') ?? [];

  const items: Array<{ id: string; text: string; href?: string; cta?: string }> = [
    ...buildInsights(data, menuStats),
    ...(openRuns.length
      ? [{ id: 'checklists', text: `${openRuns.length} ${openRuns.length === 1 ? 'checklist is' : 'checklists are'} still open today.`, href: '/admin/checklists', cta: 'Open checklists' }]
      : []),
    ...(brokenAccounts.length
      ? [{ id: 'social', text: `${brokenAccounts[0].displayName} needs to be reconnected before it can post.`, href: '/admin/social-media', cta: 'Reconnect' }]
      : []),
    ...(accounts && accounts.length === 0
      ? [{ id: 'social-none', text: 'Connect Instagram or Facebook to post your dishes straight from here.', href: '/admin/social-media', cta: 'Connect' }]
      : []),
  ];

  const t = data?.today;
  return (
    <section aria-labelledby="today-heading" className="rounded-lg border border-border bg-card p-6">
      <h2 id="today-heading" className="text-h3 text-foreground">Today</h2>
      {t ? (
        <p className="mt-1 text-body text-muted-foreground">
          {t.visitors} {t.visitors === 1 ? 'guest' : 'guests'} so far ({t.newVisitors} new, {t.returningVisitors} returning) ·{' '}
          {t.visits} {t.visits === 1 ? 'visit' : 'visits'} · {t.clicks} button {t.clicks === 1 ? 'tap' : 'taps'} · {t.searches}{' '}
          {t.searches === 1 ? 'search' : 'searches'}
        </p>
      ) : null}
      {items.length > 0 ? (
        <ul className="mt-3 divide-y divide-border">
          {items.map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-3 py-3">
              <span className="text-body text-foreground">{it.text}</span>
              {it.href ? (
                <Link href={it.href} className="shrink-0 text-body-medium text-primary hover:underline">{it.cta}</Link>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-body text-muted-foreground">Nothing needs your attention right now.</p>
      )}
    </section>
  );
}
