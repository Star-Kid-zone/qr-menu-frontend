import type { ReactNode } from "react";

export interface LoadingScreenProps {
    theme?: string | null;
    label?: ReactNode;
    fullScreen?: boolean;
    className?: string;
    surfaceClassName?: string;
    textClassName?: string;
}
