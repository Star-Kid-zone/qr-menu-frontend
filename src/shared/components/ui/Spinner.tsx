import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';
import { SpinnerProps, SpinnerSize } from "@/types/components/ui/Spinner.types";

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
};

export function Spinner({
  size = 'md',
  label,
  className,
  spinnerClassName,
}: SpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-primary/20 border-t-primary',
        sizeClasses[size],
        spinnerClassName
      )}
      aria-hidden="true"
    />
  );

  if (!label) {
    return spinner;
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-4">
        {spinner}
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}
