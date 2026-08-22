import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

export interface WithClassName {
  className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, WithClassName {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export interface FieldProps extends WithClassName {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, WithClassName {
  invalid?: boolean;
  startSlot?: ReactNode;
  endSlot?: ReactNode;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, WithClassName {
  invalid?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, WithClassName {
  invalid?: boolean;
}

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement>, WithClassName {
  label?: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement>, WithClassName {
  tone?: 'default' | 'muted' | 'ghost';
}

export interface BadgeProps extends WithClassName {
  children: ReactNode;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
}

export interface NoticeProps extends WithClassName {
  children: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'error';
}

export interface PageLoaderProps extends WithClassName {
  label?: ReactNode;
  fullScreen?: boolean;
  theme?: string;
  surfaceClassName?: string;
  textClassName?: string;
}

export interface PageHeaderProps extends WithClassName {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
}

export interface EmptyStateProps extends WithClassName {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

export interface SpinnerProps extends WithClassName {
  size?: 'sm' | 'md' | 'lg';
}

export interface ToggleCardProps extends WithClassName {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onToggle: () => void;
}
