import type { ReactNode, SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  options?: SelectOption[];
  children?: ReactNode;
  fullWidth?: boolean;
  placeholder?: string;
}
