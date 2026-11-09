import type { ReactNode } from "react";

export interface NoticeProps {
    children: ReactNode;
    tone?: NoticeTone;
    /** Short bold line above the message, e.g. "We couldn't load your menu". */
    title?: string;
    /** A single follow-up action, e.g. a "Try again" button. */
    action?: ReactNode;
    className?: string;
}

export type NoticeTone = 'info' | 'success' | 'warning' | 'error';
