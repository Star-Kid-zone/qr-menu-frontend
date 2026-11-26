import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { CardProps, CardTone } from "@/types/ui/Card.types";

const toneClasses: Record<CardTone, string> = {
  default: "rounded-xl border border-border bg-card shadow-sm",
  muted: "rounded-xl border border-border bg-muted/40",
  ghost: "rounded-xl border border-transparent bg-transparent",
};

export function Card({ className, tone = "default", interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        toneClasses[tone],
        interactive && "transition-colors hover:border-primary/40 cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 p-6 sm:p-6", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-h3 text-foreground leading-none tracking-tight", className)} {...props} />
);

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
);

