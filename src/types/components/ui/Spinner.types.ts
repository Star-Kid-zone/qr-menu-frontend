import type { ReactNode } from "react";

export interface SpinnerProps {
    size?: SpinnerSize;
    label?: ReactNode;
    className?: string;
    spinnerClassName?: string;
}

export type SpinnerSize = 'sm' | 'md' | 'lg';
