import type { ReactNode } from "react";

export interface FormFieldProps {
    label?: ReactNode;
    htmlFor?: string;
    error?: ReactNode;
    hint?: ReactNode;
    className?: string;
    labelClassName?: string;
    required?: boolean;
    actions?: ReactNode;
    children: ReactNode;
}
