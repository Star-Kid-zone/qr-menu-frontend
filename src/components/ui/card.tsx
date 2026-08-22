import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { CardProps, CardTone } from "@/types/components/ui/Card.types";

const toneClasses: Record<CardTone, string> = {
  default:
    "rounded-2xl border border-border/60 bg-card shadow-neu-sm transition-all hover:shadow-neu hover:-translate-y-0.5",
  muted: "rounded-2xl border border-border/60 bg-muted/60 shadow-neu-inset-sm",
  ghost: "rounded-2xl border border-transparent bg-transparent",
};

export function Card({ className, tone = "default", ...props }: CardProps) {
  return <div className={cn(toneClasses[tone], className)} {...props} />;
}

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
);

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
