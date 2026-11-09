import { cn } from '@/utils/cn';
import { ToggleCardProps } from "@/types/components/ui/ToggleCard.types";

export function ToggleCard({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: ToggleCardProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'w-full rounded-2xl border p-4 text-left transition-all disabled:pointer-events-none disabled:opacity-60',
        checked ? 'border-primary/30 bg-primary/5' : 'border-border bg-background',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm font-black text-foreground">{label}</p>
          {description ? (
            <p className="break-words text-caption font-bold text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            'h-6 w-12 shrink-0 rounded-full p-1 transition-all',
            checked ? 'bg-primary' : 'bg-muted'
          )}
        >
          <div
            className={cn(
              'h-4 w-4 rounded-full bg-white transition-transform',
              checked ? 'translate-x-6' : 'translate-x-0'
            )}
          />
        </div>
      </div>
    </button>
  );
}
