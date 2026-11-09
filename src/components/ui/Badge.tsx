import { cn } from "@/utils/cn";
import { BadgeProps, BadgeTone } from "@/types/components/ui/Badge.types";

// Status words, not decoration: 12px, sentence case, tinted background.
const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-accent text-accent-foreground",
  success: "bg-success/12 text-success",
  warning: "bg-warning/20 text-warning-foreground dark:text-warning",
  danger: "bg-destructive/12 text-destructive",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-caption",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
