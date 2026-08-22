import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { EmptyStateProps } from "@/types/components/ui/EmptyState.types";

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border bg-card px-4 py-10 text-center sm:px-6 sm:py-16',
        className
      )}
    >
      {icon ? (
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-transparent text-primary shadow-neu-inset-sm">
          {icon}
        </div>
      ) : null}
      <div className="w-full max-w-md space-y-2">
        <h3 className="break-words text-2xl font-black text-foreground">{title}</h3>
        {description ? <p className="max-w-md break-words text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
