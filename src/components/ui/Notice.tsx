import { PiCheckCircle, PiInfo, PiWarning, PiWarningCircle } from 'react-icons/pi';
import { cn } from '@/utils/cn';
import { NoticeProps, NoticeTone } from "@/types/components/ui/Notice.types";

// Tone lives in the icon and the left rule; the message itself stays in the
// body colour so it always meets contrast (amber text on amber did not).
const toneStyles: Record<NoticeTone, { rule: string; icon: string; Icon: typeof PiInfo }> = {
  info: { rule: 'border-l-info', icon: 'text-info', Icon: PiInfo },
  success: { rule: 'border-l-success', icon: 'text-success', Icon: PiCheckCircle },
  warning: { rule: 'border-l-warning', icon: 'text-warning', Icon: PiWarning },
  error: { rule: 'border-l-destructive', icon: 'text-destructive', Icon: PiWarningCircle },
};

export function Notice({ children, tone = 'info', title, action, className }: NoticeProps) {
  const { rule, icon, Icon } = toneStyles[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-lg border border-border border-l-4 bg-card px-4 py-3 text-body text-foreground',
        rule,
        className
      )}
    >
      <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', icon)} />
      <div className="min-w-0 flex-1 break-words">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn(title && 'mt-0.5 text-muted-foreground')}>{children}</div>
      </div>
      {action ? <div className="shrink-0 self-center">{action}</div> : null}
    </div>
  );
}
