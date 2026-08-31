import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { EmptyStateProps } from "@/types/components/ui/EmptyState.types";

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center',
        className
      )}
    >
      {icon ? (
        <div className="mb-5 flex size-14 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <div className="w-full max-w-xs space-y-1.5">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
