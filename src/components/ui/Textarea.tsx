import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { TextareaProps } from "@/types/components/ui/Textarea.types";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, fullWidth = true, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-24 w-full rounded-md border border-input bg-card px-3 py-2 text-sm font-normal text-foreground transition-colors placeholder:text-muted-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:bg-muted",
          invalid &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
          fullWidth && "w-full",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
