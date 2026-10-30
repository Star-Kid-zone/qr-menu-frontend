import { cn } from "@/utils/cn";
import { BadgeProps, BadgeTone } from "@/types/components/ui/Badge.types";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  primary: "border-primary/20 bg-primary/15 text-primary",
  success: "border-success/20 bg-success/15 text-success",
  warning: "border-warning/20 bg-warning/15 text-warning",
  danger: "border-destructive/20 bg-destructive/15 text-destructive",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
