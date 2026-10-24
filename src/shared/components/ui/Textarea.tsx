import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { TextareaProps } from "@/types/components/ui/Textarea.types";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, fullWidth = true, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-all placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/5 disabled:opacity-50 disabled:bg-muted",
          invalid &&
            "border-destructive focus:border-destructive focus:ring-destructive/10",
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
