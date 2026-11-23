import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  fullWidth?: boolean;
  startSlot?: ReactNode;
  endSlot?: ReactNode;
}
