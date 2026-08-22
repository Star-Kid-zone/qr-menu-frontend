"use client";

import { PiLockSimpleBold, PiStarFill } from "react-icons/pi";

const FRAME = "flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-white/10 bg-[#15100c] p-8";

// A recognizable QR shape (three corner "finder" blocks + a pseudo-random
// data grid), not a stock photo — this is what "custom QR styling" actually
// looks like. It's illustrative, not a scannable code.
const QR_SIZE = 7;
const QR_NOISE = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0];

function isQrFinderCell(row: number, col: number, size: number): boolean {
  const topLeft = row < 3 && col < 3;
  const topRight = row < 3 && col >= size - 3;
  const bottomLeft = row >= size - 3 && col < 3;
  return topLeft || topRight || bottomLeft;
}

function QrGrid({ size, className }: { size: number; className?: string }) {
  const cells = Array.from({ length: size * size }, (_, i) => i);
  return (
    <div className={className} style={{ display: "grid", gridTemplateColumns: `repeat(${size}, 1fr)`, gap: 2 }}>
      {cells.map((i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const dark = isQrFinderCell(row, col, size) || QR_NOISE[i % QR_NOISE.length] === 1;
        return <span key={i} className="rounded-[1px]" style={{ backgroundColor: dark ? "#0d0906" : "transparent" }} />;
      })}
    </div>
  );
}

export function QrVisual() {
  return (
    <div className={FRAME}>
      <div className="relative flex h-40 w-40 items-center justify-center rounded-xl bg-white p-3 sm:h-48 sm:w-48">
        <QrGrid size={QR_SIZE} className="h-full w-full" />
        <span className="absolute flex h-10 w-10 items-center justify-center rounded-md bg-primary text-[8px] font-bold text-primary-foreground">
          LOGO
        </span>
      </div>
    </div>
  );
}

export function ReviewVisual() {
  return (
    <div className={FRAME}>
      <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-clay-coral" />
          <div>
            <p className="text-caption font-semibold text-white">Priya M.</p>
            <div className="mt-0.5 flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <PiStarFill key={i} size={11} />
              ))}
            </div>
          </div>
          <span className="ml-auto rounded-full bg-white/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-white/50">
            Google
          </span>
        </div>
        <p className="mt-3 text-caption leading-relaxed text-white/60">
          &ldquo;Best butter chicken in town, and the QR menu made ordering so easy.&rdquo;
        </p>
      </div>
    </div>
  );
}

export function LoyaltyVisual() {
  const reels = ["🍕", "⭐", "🎁"];
  return (
    <div className={FRAME}>
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-5">
        <div className="flex gap-2 rounded-xl bg-[#0d0906] p-3">
          {reels.map((emoji, i) => (
            <div key={i} className="flex h-14 w-12 items-center justify-center rounded-lg bg-white/5 text-2xl">
              {emoji}
            </div>
          ))}
        </div>
        <div className="flex h-16 w-6 flex-col items-center justify-end gap-1">
          <div className="h-6 w-6 rounded-full bg-primary" />
          <div className="h-10 w-1.5 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export function PaymentVisual() {
  return (
    <div className={FRAME}>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white p-2">
          <QrGrid size={5} className="h-full w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="rounded-full bg-primary px-4 py-2 text-center text-caption font-bold text-primary-foreground">
            Pay bill
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Scan to pay</span>
        </div>
      </div>
    </div>
  );
}

export function StaffVisual() {
  const items = ["Menu", "Workspace", "Analytics", "Payments", "Marketing"];
  return (
    <div className={FRAME}>
      <div className="grid w-full max-w-xs grid-cols-2 gap-3">
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Owner</p>
          <ul className="mt-2 space-y-1.5">
            {items.map((item) => (
              <li key={item} className="text-[11px] font-medium text-white/70">{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Staff</p>
          <ul className="mt-2 space-y-1.5">
            {items.map((item, i) => (
              <li key={item} className="flex items-center gap-1 text-[11px] font-medium text-white/70">
                {i > 1 && <PiLockSimpleBold size={9} className="text-white/30" />}
                <span className={i > 1 ? "text-white/30 line-through" : ""}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const CHART_BARS = [40, 65, 45, 80, 60, 90, 70];

export function AnalyticsVisual() {
  return (
    <div className={FRAME}>
      <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Visits, last 7 days</span>
          <span className="text-caption font-bold text-primary">+18%</span>
        </div>
        <div className="mt-4 flex h-24 items-end gap-2">
          {CHART_BARS.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${i === CHART_BARS.length - 1 ? "bg-primary" : "bg-white/15"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-white/40">
          <span>Top dish: Truffle Steak</span>
          <span>1.2k views</span>
        </div>
      </div>
    </div>
  );
}

export function PosterVisual() {
  return (
    <div className={FRAME}>
      <div className="relative flex aspect-[4/5] w-32 -rotate-3 flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-clay-coral via-primary to-clay-gold p-4 shadow-2xl sm:w-40">
        <span className="w-fit rounded-full bg-white/20 px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-white">
          Weekend Only
        </span>
        <div>
          <p className="font-display text-2xl font-bold uppercase leading-none text-white sm:text-3xl">30%</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">Off everything</p>
        </div>
      </div>
    </div>
  );
}

export function OffersVisual() {
  return (
    <div className={FRAME}>
      <div className="grid w-full max-w-xs grid-cols-3 gap-2">
        <div className="col-span-2 flex flex-col justify-end rounded-xl bg-gradient-to-br from-clay-coral to-primary p-3">
          <span className="text-caption font-bold text-white">20% OFF</span>
          <span className="text-[9px] font-semibold uppercase tracking-wide text-white/80">This weekend</span>
        </div>
        <div className="rounded-xl bg-white/10" />
        <div className="rounded-xl bg-white/10" />
        <div className="rounded-xl bg-white/10" />
        <div className="rounded-xl bg-white/10" />
      </div>
    </div>
  );
}
