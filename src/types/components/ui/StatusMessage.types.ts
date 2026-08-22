import type { ReactNode } from "react";

export interface StatusMessageProps {
    variant?: StatusVariant;
    children: ReactNode;
    className?: string;
}

export type StatusVariant = 'error' | 'success' | 'info' | 'warning';
