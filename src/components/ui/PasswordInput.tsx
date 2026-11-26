"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Input } from "./input";
import type { PasswordInputProps } from "@/types/ui/PasswordInput.types";

/** Password field with a Show/Hide toggle. Pass `autoComplete` ("current-password" or "new-password"). */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input ref={ref} type={visible ? "text" : "password"} className={cn("pr-16", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-controls={props.id}
        className="absolute inset-y-0 right-0 rounded-r-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
      >
        {visible ? "Hide" : "Show"}
        <span className="sr-only"> password</span>
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
