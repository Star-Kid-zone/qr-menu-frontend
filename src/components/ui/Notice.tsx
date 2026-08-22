import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { NoticeProps, NoticeTone } from "@/types/components/ui/Notice.types";

const toneClasses: Record<NoticeTone, string> = {
  info: 'border-primary/20 bg-primary/5 text-primary',
  success: 'border-success/20 bg-success/10 text-success',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  error: 'border-destructive/20 bg-destructive/10 text-destructive',
};

export function Notice({ children, tone = 'info', className }: NoticeProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm font-semibold break-words',
        toneClasses[tone],
        className
      )}
    >
      {children}
    </div>
  );
}
