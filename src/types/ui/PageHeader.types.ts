import type { ReactNode } from "react";

export interface PageHeaderProps {
    title: string;
    description?: string;
    /** @deprecated Eyebrow labels are no longer shown (design pattern rule 10). */
    eyebrow?: string;
    actions?: ReactNode;
    onBack?: () => void;
    backLabel?: string;
    className?: string;
}
