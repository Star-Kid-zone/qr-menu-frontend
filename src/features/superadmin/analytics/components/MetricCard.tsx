'use client';

import { Card, Badge } from '@/components/ui';
import type { MetricCardProps } from '../types';

export function MetricCard({
  title,
  value,
  sub,
  badge,
  badgeTone = 'neutral',
  icon,
  highlight = false,
  highlightTone = 'cyan',
}: MetricCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between p-5 transition-colors hover:border-primary/30">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div
            className={`flex size-9 items-center justify-center rounded-lg ${
              highlight
                ? highlightTone === 'emerald'
                  ? 'bg-emerald-500/15 text-emerald-500'
                  : 'bg-primary/15 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {icon}
          </div>
          {badge && <Badge tone={badgeTone}>{badge}</Badge>}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      </div>

      <div className="mt-3">
        <p className="tabular-figures text-display font-extrabold text-foreground">{value.toLocaleString()}</p>
        {sub && <p className="mt-1 text-caption text-muted-foreground">{sub}</p>}
      </div>
    </Card>
  );
}
