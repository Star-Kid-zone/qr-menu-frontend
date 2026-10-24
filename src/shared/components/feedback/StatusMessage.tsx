import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { StatusMessageProps, StatusVariant } from "@/types/components/ui/StatusMessage.types";

const variantClasses: Record<StatusVariant, string> = {
  error: 'border-destructive/20 bg-destructive/10 text-destructive',
  success: 'border-success/20 bg-success/10 text-success',
  info: 'border-primary/20 bg-primary/10 text-primary',
  warning: 'border-warning/20 bg-warning/10 text-warning',
};

export function StatusMessage({
  variant = 'info',
  children,
  className,
}: StatusMessageProps) {
  return (
    <div className={cn('rounded-2xl border p-4', variantClasses[variant], className)}>
      <p className="text-center text-xs font-bold uppercase tracking-wide break-words">{children}</p>
    </div>
  );
}
