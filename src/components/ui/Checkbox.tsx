import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { CheckboxProps } from "@/types/ui/Checkbox.types";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((
  { className, label, description, id, invalid = false, ...props },
  ref
) => {
  return (
    <label
      htmlFor={id}
      className={cn('flex cursor-pointer items-start gap-3 text-sm text-foreground', className)}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn(
          'mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/20',
          invalid && 'border-destructive text-destructive'
        )}
        {...props}
      />
      {(label || description) && (
        <span className="min-w-0 space-y-0.5">
          {label ? <span className="block break-words font-medium text-foreground">{label}</span> : null}
          {description ? (
            <span className="block break-words text-xs text-muted-foreground">{description}</span>
          ) : null}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
