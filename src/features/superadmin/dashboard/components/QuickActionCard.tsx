'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { PiArrowRightBold } from 'react-icons/pi';

export interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}

export function QuickActionCard({ title, description, href, icon }: QuickActionCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="flex h-full flex-col justify-between p-6 transition-colors hover:border-primary/30">
        <div className="space-y-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
            {icon}
          </div>
          <div className="space-y-1">
            <h2 className="text-h2 text-foreground">
              {title}
            </h2>
            <p className="text-body text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-caption text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Access Module <PiArrowRightBold className="size-3" />
        </div>
      </Card>
    </Link>
  );
}
