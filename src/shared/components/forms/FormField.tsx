import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { FormFieldProps } from "@/types/components/ui/FormField.types";

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
  labelClassName,
  required,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className={cn(
            "flex items-center gap-1.5 text-caption uppercase tracking-wide text-muted-foreground break-words",
            labelClassName
          )}
        >
          {label}
          {required ? <span className="text-destructive">*</span> : null}
        </label>
      ) : null}
      <div className="relative w-full">{children}</div>
      {error ? (
        <p className="text-caption text-destructive break-words animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      ) : hint ? (
        <p className="text-caption text-muted-foreground break-words">{hint}</p>
      ) : null}
    </div>
  );
}

export const Field = FormField;
export default FormField;
