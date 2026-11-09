"use client";

import React from "react";
import { PiStarBold, PiStarFill } from "react-icons/pi";

interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <PiStarFill key={i} size={14} className="text-warning" />
        ) : (
          <PiStarBold key={i} size={14} className="text-muted-foreground/50" />
        )
      )}
    </div>
  );
}
