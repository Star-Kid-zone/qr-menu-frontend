import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    tone?: CardTone;
}

export type CardTone = 'default' | 'muted' | 'ghost';
