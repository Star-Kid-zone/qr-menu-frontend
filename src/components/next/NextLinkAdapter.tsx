'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { NextLinkAdapterProps } from "@/types/ui/NextLinkAdapter.types";

export function NextLinkAdapter({ to, className, children, onClick, style }: NextLinkAdapterProps) {
  return (
    <Link href={to} className={className} onClick={onClick} style={style}>
      {children}
    </Link>
  );
}
