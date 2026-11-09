import { Children, cloneElement, isValidElement, type ReactElement } from "react";
import { PiWarningCircle } from "react-icons/pi";
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
  const hintId = htmlFor && hint ? `${htmlFor}-hint` : undefined;
  const errorId = htmlFor && error ? `${htmlFor}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  // Link the hint/error to the control for screen readers when the field
  // wraps a single input element.
  const only = Children.count(children) === 1 ? Children.only(children) : null;
  const control =
    only && isValidElement(only) && describedBy
      ? cloneElement(only as ReactElement<Record<string, unknown>>, {
          "aria-describedby": describedBy,
          ...(error ? { "aria-invalid": true } : {}),
        })
      : children;

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className={cn("flex items-baseline gap-1 text-body-medium text-foreground break-words", labelClassName)}
        >
          {label}
          {required ? (
            <>
              <span aria-hidden className="text-destructive">*</span>
              <span className="sr-only">(required)</span>
            </>
          ) : null}
        </label>
      ) : null}
      <div className="relative w-full">{control}</div>
      {hint && !error ? (
        <p id={hintId} className="text-caption text-muted-foreground break-words">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-start gap-2 text-caption text-destructive break-words">
          <PiWarningCircle aria-hidden className="mt-px size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const Field = FormField;
export default FormField;
