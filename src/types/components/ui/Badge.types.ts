import type { ReactNode } from "react";

export interface BadgeProps {
    children: ReactNode;
    tone?: BadgeTone;
    className?: string;
}

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
