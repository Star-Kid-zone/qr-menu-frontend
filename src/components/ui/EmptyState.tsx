import { cn } from '@/utils/cn';
import { EmptyStateProps } from "@/types/ui/EmptyState.types";

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full min-h-[340px] flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 p-8 sm:p-12 text-center transition-colors',
        className
      )}
    >
      {icon ? (
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-border bg-muted/60 text-muted-foreground shadow-xs">
          {icon}
        </div>
      ) : null}
      <div className="w-full max-w-md space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground leading-relaxed">{description}</p> : null}
      </div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
