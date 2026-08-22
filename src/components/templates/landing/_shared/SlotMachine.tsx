"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { PiLockSimpleBold } from "react-icons/pi";

const FILLER_SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "7️⃣", "🍇", "💎"];
const ITEM_HEIGHT = 72; // px, must match the fixed-height symbol cell below
const REEL_LENGTH = 24; // how many symbols scroll past before landing

function buildStrip(target: string, seed: number) {
  // Deterministic-ish pseudo-random filler so re-renders don't jitter mid-spin.
  const strip: string[] = [];
  for (let i = 0; i < REEL_LENGTH - 1; i++) {
    strip.push(FILLER_SYMBOLS[(i * 7 + seed) % FILLER_SYMBOLS.length]);
  }
  strip.push(target); // the reel always lands on this
  return strip;
}

function Reel({
  target,
  spinKey,
  delay,
  priming,
}: {
  target: string;
  spinKey: number;
  delay: number;
  priming: boolean;
}) {
  const strip = useMemo(() => buildStrip(target, spinKey * 13 + delay * 100), [target, spinKey, delay]);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setSettled(false);
  }, [spinKey]);

  return (
    <div
      className="relative h-[72px] w-20 overflow-hidden rounded-xl border-2 border-black/10 bg-white shadow-inner sm:w-24"
      style={{ height: ITEM_HEIGHT }}
    >
      <motion.div
        key={spinKey}
        initial={{ y: 0 }}
        animate={
          spinKey === 0
            ? { y: 0 }
            : { y: -(strip.length - 1) * ITEM_HEIGHT }
        }
        transition={{ duration: 1.4 + delay * 0.35, ease: [0.12, 0.75, 0.28, 1], delay: delay * 0.15 }}
        onAnimationComplete={() => spinKey !== 0 && setSettled(true)}
        className="flex flex-col"
      >
        {strip.map((sym, i) => (
          <div key={i} className="flex items-center justify-center text-4xl" style={{ height: ITEM_HEIGHT }}>
            {sym}
          </div>
        ))}
      </motion.div>
      {/* While waiting on the server result, give the reels a subtle "engine idling"
          shimmer so the pull doesn't feel dead before the real spin kicks in. */}
      {priming && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-white"
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: delay * 0.1 }}
        />
      )}
      <div className={`pointer-events-none absolute inset-0 rounded-xl ring-2 transition-all ${settled ? "ring-amber-400/70" : "ring-transparent"}`} />
    </div>
  );
}

/** The pull-handle on the side of the cabinet — click (or tap) it to play. */
function Lever({ disabled, onPull }: { disabled: boolean; onPull: () => void }) {
  const controls = useAnimation();
  const [pulling, setPulling] = useState(false);

  const handleClick = async () => {
    if (disabled || pulling) return;
    setPulling(true);
    await controls.start({ y: 92, transition: { duration: 0.22, ease: "easeIn" } });
    onPull();
    await controls.start({ y: 0, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } });
    setPulling(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pulling}
      aria-label="Pull the lever to play"
      className="group relative flex h-[220px] w-10 shrink-0 flex-col items-center rounded-full bg-gradient-to-b from-zinc-600 to-zinc-800 p-1.5 shadow-inner disabled:cursor-not-allowed disabled:opacity-50 sm:w-12"
    >
      <div className="h-full w-2 rounded-full bg-black/40 sm:w-2.5" />
      <motion.div
        animate={controls}
        className="absolute left-1/2 top-1.5 flex -translate-x-1/2 flex-col items-center"
      >
        <div className="size-8 rounded-full bg-gradient-to-b from-red-400 to-red-600 shadow-lg ring-2 ring-red-300/50 transition-transform group-active:scale-95 sm:size-9" />
        <div className="mt-0.5 h-10 w-2.5 rounded-full bg-gradient-to-b from-zinc-300 to-zinc-500 sm:w-3" />
      </motion.div>
    </button>
  );
}

/**
 * A 3-reel slot-machine cabinet with a pull-lever. Reels are purely a visual
 * reveal of an outcome already decided server-side (`playLottery`) — pulling
 * the lever fires `onPull` (which kicks off the play request), and once the
 * caller knows the outcome it bumps `spinKey` with the final `targetSymbols`
 * for the reels to land on, staggered, 3-of-a-kind = a win.
 */
export function SlotMachine({
  targetSymbols,
  spinKey,
  disabled,
  waiting,
  onPull,
  onSettled,
}: {
  targetSymbols: [string, string, string];
  spinKey: number;
  /** True once already played today, or while a play is in flight — locks the lever. */
  disabled?: boolean;
  /** True between the lever pull and the server response arriving. */
  waiting?: boolean;
  onPull: () => void;
  onSettled?: () => void;
}) {
  useEffect(() => {
    if (spinKey === 0) return;
    const t = setTimeout(() => onSettled?.(), 1400 + 2 * 350 + 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex gap-3 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 p-4 shadow-xl">
        {/* Marquee lights */}
        <div className="absolute inset-x-3 -top-1.5 flex justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_2px_rgba(252,211,77,0.7)]"
            />
          ))}
        </div>
        {targetSymbols.map((sym, i) => (
          <Reel key={i} target={sym} spinKey={spinKey} delay={i} priming={Boolean(waiting)} />
        ))}
        {disabled && !waiting && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-[1px]">
            <PiLockSimpleBold className="size-6 text-white/80" />
          </div>
        )}
      </div>
      <Lever disabled={Boolean(disabled) || Boolean(waiting)} onPull={onPull} />
    </div>
  );
}
