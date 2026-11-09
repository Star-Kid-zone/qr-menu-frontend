'use client';

import type { ReactNode } from 'react';
import { Card } from '@/components/ui';

export interface PlatformMetricProps {
  title: string;
  value: number;
  sub: string;
  details: Array<{ label: string; value: number }>;
  icon: ReactNode;
  highlight?: boolean;
}

export function PlatformMetric({
  title,
  value,
  sub,
  details,
  icon,
  highlight = false,
}: PlatformMetricProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-caption text-muted-foreground">{title}</p>
        <div
          className={`flex size-9 items-center justify-center rounded-lg ${
            highlight ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="tabular-figures text-display text-foreground">{value.toLocaleString()}</p>
      <div className="mt-4 space-y-2 border-t border-border pt-4">
        <p className="text-caption text-muted-foreground">{sub}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {details.map((d, i) => (
            <span key={i} className="text-caption text-foreground">
              {d.value.toLocaleString()} {d.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
