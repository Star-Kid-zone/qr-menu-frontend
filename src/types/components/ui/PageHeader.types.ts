import type { ReactNode } from "react";

export interface PageHeaderProps {
    title: string;
    description?: string;
    eyebrow?: string;
    actions?: ReactNode;
    onBack?: () => void;
    backLabel?: string;
    className?: string;
}
