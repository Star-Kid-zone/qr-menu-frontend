import type { ReactNode } from "react";

export interface NoticeProps {
    children: ReactNode;
    tone?: NoticeTone;
    className?: string;
}

export type NoticeTone = 'info' | 'success' | 'warning' | 'error';
