"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/utils/cn";
import type { OtpInputProps } from "@/types/ui/OtpInput.types";

/**
 * One box per digit. Typing moves to the next box, Backspace goes back, and a
 * pasted or autofilled code (iOS/Android put the whole code in the first box)
 * fills every box at once.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  id,
  invalid,
  disabled,
  autoFocus,
  label,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");
  const isInvalid = invalid || ariaInvalid;

  const focusBox = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  /** Writes `typed` starting at box `index` (one digit, or a whole code). */
  const fillFrom = (index: number, typed: string) => {
    const incoming = typed.replace(/\D/g, "");
    if (!incoming) return;
    // A full code always replaces everything, wherever it lands.
    if (incoming.length >= length) {
      commit(incoming);
      focusBox(length - 1);
      return;
    }
    // The code has no gaps: a digit typed past the first empty box lands in that box.
    const start = Math.min(index, value.length);
    commit(value.slice(0, start) + incoming + value.slice(start + incoming.length));
    focusBox(start + incoming.length);
  };

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i]) {
        commit(value.slice(0, i));
      } else if (i > 0) {
        commit(value.slice(0, i - 1));
        focusBox(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    }
  };

  const onPaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    fillFrom(i, e.clipboardData.getData("text"));
  };

  return (
    <div role="group" aria-label={label} aria-describedby={describedBy} className="flex gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          id={i === 0 ? id : `${id}-${i + 1}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          // The first box takes a whole autofilled code; the rest one digit each.
          maxLength={i === 0 ? length : 1}
          value={d}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={isInvalid || undefined}
          onChange={(e) => fillFrom(i, e.target.value.slice(-length))}
          onKeyDown={onKeyDown(i)}
          onPaste={onPaste(i)}
          onFocus={(e) => e.target.select()}
          className={cn(
            "h-12 w-full min-w-0 rounded-md border border-input bg-card text-center font-mono text-lg font-semibold text-foreground tabular-nums outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50",
            isInvalid && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
          )}
        />
      ))}
    </div>
  );
}
