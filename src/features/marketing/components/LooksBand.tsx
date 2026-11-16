"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { LOOKS_WITH_PHOTOS } from "../content";

/*
 * Two rows of real look photos (the ones shipped under public/landing/) that
 * slide in opposite directions as the page scrolls. The band is tilted a
 * little, like cards fanned out on a table.
 */

const ROW_A = LOOKS_WITH_PHOTOS.slice(0, 8);
const ROW_B = LOOKS_WITH_PHOTOS.slice(8);

function Row({
  items,
  x,
  kind,
}: {
  items: typeof LOOKS_WITH_PHOTOS;
  x: MotionValue<number>;
  kind: "hero" | "dish";
}) {
  return (
    <motion.div style={{ x }} className="flex w-max gap-4">
      {items.map((look) => (
        <figure key={look.slug} className="mkt-look">
          <Image
            src={`/landing/${look.slug}/${look.photo ?? kind}.${look.ext ?? "jpg"}`}
            alt={`${look.label} look`}
            fill
            sizes="240px"
          />
          <figcaption className="mkt-look-label">{look.label}</figcaption>
        </figure>
      ))}
    </motion.div>
  );
}

export function LooksBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xA = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -420]);
  const xB = useTransform(scrollYProgress, [0, 1], [-420, reduce ? -420 : 0]);

  return (
    <div ref={ref} className="relative -rotate-2 space-y-4 py-6" aria-hidden>
      <Row items={ROW_A} x={xA} kind="hero" />
      <Row items={ROW_B} x={xB} kind="dish" />
    </div>
  );
}
