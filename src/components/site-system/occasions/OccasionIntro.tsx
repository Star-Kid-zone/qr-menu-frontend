"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { OccasionDefinition } from "../types";
import { SiteLottie, type LottieId } from "../kit/lottie/SiteLottie";
import { INTRO_DURATION_MS, OCCASION_INTROS, type IntroFlyer, type IntroParticles } from "./intros";

/* Deterministic "random" spread, so every guest sees the same composition. */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const CSS = `
.occi{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;overflow:hidden;animation:occi-in .45s ease-out both}
.occi.out{animation:occi-out .55s ease-in forwards}
@keyframes occi-in{from{opacity:0}to{opacity:1}}
@keyframes occi-out{to{opacity:0;visibility:hidden}}
.occi-p{position:absolute;top:0;left:var(--x);width:var(--s);height:var(--s);opacity:0;will-change:transform,opacity}
.occi-fall{animation:occi-fall var(--t) linear var(--d) infinite}
@keyframes occi-fall{0%{opacity:0;transform:translate3d(0,-12vh,0) rotate(0)}10%{opacity:1}100%{opacity:.9;transform:translate3d(var(--dx),112vh,0) rotate(var(--r))}}
.occi-rise{top:auto;bottom:0;animation:occi-rise var(--t) ease-out var(--d) infinite}
@keyframes occi-rise{0%{opacity:0;transform:translate3d(0,12vh,0) scale(.7)}15%{opacity:1}100%{opacity:0;transform:translate3d(var(--dx),-112vh,0) scale(1)}}
.occi-twinkle{top:var(--y);animation:occi-twinkle var(--t) ease-in-out var(--d) infinite}
@keyframes occi-twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
.occi-puff{top:var(--y);filter:blur(10px);animation:occi-puff var(--t) ease-out var(--d) both}
@keyframes occi-puff{0%{opacity:0;transform:scale(.2)}40%{opacity:.85}100%{opacity:0;transform:scale(2.4)}}
.occi-burst{position:absolute;left:var(--x);top:var(--y);width:0;height:0}
.occi-burst i{position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:9999px;opacity:0;box-shadow:0 0 10px 2px currentColor;animation:occi-ray 1.6s cubic-bezier(.15,.75,.3,1) var(--d) infinite}
@keyframes occi-ray{0%{opacity:0;transform:rotate(var(--a)) translateX(0) scale(1)}8%{opacity:1}70%{opacity:1}100%{opacity:0;transform:rotate(var(--a)) translateX(var(--len)) scale(.4)}}
.occi-fly{position:absolute;will-change:transform}
.occi-sleigh{left:0;top:6vh;width:min(52vw,460px);animation:occi-sleigh 3.4s cubic-bezier(.45,.05,.55,.95) .15s both}
@keyframes occi-sleigh{0%{transform:translate(-60vw,22vh) rotate(-7deg)}100%{transform:translate(112vw,-4vh) rotate(-3deg)}}
.occi-trail{position:absolute;right:92%;top:58%;width:40%;height:2px;background:linear-gradient(90deg,transparent,currentColor);opacity:.6;filter:blur(1px)}
.occi-kite{left:60%;top:20%;width:min(22vw,150px);animation:occi-kite 3.4s ease-in-out both}
@keyframes occi-kite{0%{transform:translate(-30vw,40vh) rotate(-12deg)}50%{transform:translate(0,0) rotate(8deg)}100%{transform:translate(10vw,-6vh) rotate(-6deg)}}
.occi-lantern{bottom:-20vh;left:var(--x);width:var(--s);animation:occi-lift var(--t) ease-out var(--d) both}
@keyframes occi-lift{0%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-60vh) rotate(4deg)}100%{transform:translateY(-130vh) rotate(-3deg)}}
.occi-bat{left:0;top:var(--y);width:var(--s);animation:occi-bat 2.8s ease-in-out var(--d) both}
.occi-bat svg{animation:occi-flap .25s ease-in-out infinite alternate;transform-origin:center}
@keyframes occi-bat{0%{transform:translate(-20vw,10vh)}100%{transform:translate(120vw,-20vh)}}
@keyframes occi-flap{from{transform:scaleY(1)}to{transform:scaleY(.45)}}
.occi-boat{left:0;bottom:8vh;width:min(60vw,520px);animation:occi-boat 3.6s ease-in-out both}
@keyframes occi-boat{0%{transform:translate(-70vw,0) rotate(1deg)}50%{transform:translate(20vw,-1vh) rotate(-1.5deg)}100%{transform:translate(110vw,0) rotate(1deg)}}
.occi-centre{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:1rem;padding:1.5rem;text-align:center;animation:occi-centre .7s cubic-bezier(.2,.8,.2,1) .15s both}
@keyframes occi-centre{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:none}}
.occi-skip{position:absolute;right:1rem;bottom:calc(1rem + env(safe-area-inset-bottom));z-index:3;border-radius:9999px;padding:.5rem 1rem;font:500 14px/1 system-ui,sans-serif;backdrop-filter:blur(6px)}
.occi-skip:focus-visible{outline:2px solid currentColor;outline-offset:3px}
`;

function Shape({ kind, colour }: { kind: IntroParticles; colour: string }) {
  switch (kind) {
    case "snow":
      return <span className="block h-full w-full rounded-full" style={{ background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,.8)" }} />;
    case "confetti":
      return <span className="block h-1/2 w-full rounded-[2px]" style={{ background: colour }} />;
    case "bubbles":
      return <span className="block h-full w-full rounded-full" style={{ border: `2px solid ${colour}`, background: "rgba(255,255,255,.15)" }} />;
    case "colours":
      return <span className="block h-full w-full rounded-full" style={{ background: colour }} />;
    case "petals":
      return <span className="block h-full w-full" style={{ background: colour, borderRadius: "70% 0 70% 0" }} />;
    case "hearts":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill={colour}>
          <path d="M12 21s-8-4.9-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 6.1-8 11-8 11z" />
        </svg>
      );
    case "leaves":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill={colour}>
          <path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16zm0 0 9-9" stroke={colour} />
        </svg>
      );
    default: // stars, sparkles
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill={colour}>
          <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
        </svg>
      );
  }
}

function Particles({ kind, tints }: { kind: IntroParticles; tints: readonly string[] }) {
  const colour = (i: number) => tints[i % tints.length];
  if (kind === "fireworks") {
    return (
      <>
        <Particles kind="sparkles" tints={tints} />
        {Array.from({ length: 9 }, (_, b) => (
          <span key={b} className="occi-burst" style={{ "--x": `${10 + rand(b, 1) * 80}%`, "--y": `${10 + rand(b, 2) * 55}%` } as CSSProperties}>
            {Array.from({ length: 18 }, (_, r) => (
              <i
                key={r}
                style={{ "--a": `${(r / 18) * 360}deg`, "--len": `${90 + rand(b, 3) * 90}px`, "--d": `${b * 0.32}s`, background: colour(b), color: colour(b) } as CSSProperties}
              />
            ))}
          </span>
        ))}
      </>
    );
  }  const count = kind === "colours" ? 9 : kind === "stars" || kind === "sparkles" ? 26 : 42;
  const mode = kind === "colours" ? "occi-puff" : kind === "stars" || kind === "sparkles" ? "occi-twinkle" : kind === "hearts" || kind === "bubbles" ? "occi-rise" : "occi-fall";
  const size = (i: number) => (kind === "colours" ? 120 + rand(i, 4) * 160 : kind === "snow" ? 4 + rand(i, 4) * 7 : kind === "confetti" ? 8 + rand(i, 4) * 8 : 10 + rand(i, 4) * 16);
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={`occi-p ${mode}`}
          style={
            {
              "--x": `${rand(i, 5) * 100}%`,
              "--y": `${rand(i, 6) * 90}%`,
              "--s": `${size(i)}px`,
              "--t": `${(kind === "colours" ? 1.6 : 2.6) + rand(i, 7) * 2}s`,
              "--d": `${rand(i, 8) * (kind === "colours" ? 2 : 1.6)}s`,
              "--dx": `${(rand(i, 9) - 0.5) * 18}vw`,
              "--r": `${(rand(i, 10) - 0.5) * 720}deg`,
            } as CSSProperties
          }
        >
          <Shape kind={kind} colour={colour(i)} />
        </span>
      ))}
    </>
  );
}

/* Silhouettes that cross the screen, in the festival's ink colour. */
function Reindeer({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 6)`}>
      <ellipse cx="26" cy="26" rx="17" ry="7.5" />
      <path d="M38 22l9-11 4 2-7 12z" />
      <ellipse cx="50" cy="11" rx="6.5" ry="4" />
      <path d="M58 12l4 1-1 2-4-1z" />
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M48 7l-3-7M47 3l-5-2M52 7l2-7M53 3l5-1" />
        <path d="M37 30l9 9M34 31l4 12M17 30l-9 8M20 31l-3 12" />
        <path d="M9 23l-5-3" />
      </g>
    </g>
  );
}

const SLEIGH = (
  <svg viewBox="0 0 300 80" fill="currentColor" aria-hidden>
    <Reindeer x={0} />
    <Reindeer x={66} />
    {/* reins */}
    <path d="M118 20C150 28 170 34 196 38" fill="none" stroke="currentColor" strokeWidth="1.4" />
    {/* sack of presents */}
    <path d="M232 40c-4-16 6-28 20-26 12 2 16 16 10 26z" />
    {/* Santa: hat with bobble, head, coat */}
    <path d="M206 20l12-14 10 13z" />
    <circle cx="204" cy="20" r="3.5" />
    <circle cx="217" cy="25" r="7" />
    <path d="M204 44c0-10 6-16 13-16s13 6 13 16z" />
    {/* sleigh body and curled runner */}
    <path d="M192 40h76c6 0 10 4 10 10v6h-84c-6 0-10-4-10-10 0-3 3-6 8-6z" />
    <path d="M180 66h96c10 0 14-6 16-12l4 2c-2 9-8 14-20 14h-96c-5 0-8-3-8-6l4-2c0 2 2 4 4 4z" />
    <path d="M200 56v10M262 56v10" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);const KITE = (
  <svg viewBox="0 0 60 120" aria-hidden>
    <path d="M30 2 56 34 30 70 4 34z" fill="currentColor" />
    <path d="M30 2v68M4 34h52" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
    <path d="M30 70c-6 10 6 16 0 26s6 16 0 22" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const LANTERN = (
  <svg viewBox="0 0 40 70" aria-hidden>
    <path d="M20 0v8" stroke="currentColor" strokeWidth="2" />
    <path d="M10 10h20l6 26-16 22-16-22z" fill="currentColor" />
    <ellipse cx="20" cy="34" rx="7" ry="10" fill="rgba(255,236,170,.9)" />
  </svg>
);
const BAT = (
  <svg viewBox="0 0 64 28" fill="currentColor" aria-hidden>
    <path d="M32 10c2-4 4-6 4-6l1 5c6-6 16-8 27-4-6 2-10 6-11 12-4-3-9-3-12 1-2-3-5-4-9-4s-7 1-9 4c-3-4-8-4-12-1C10 11 6 7 0 5c11-4 21-2 27 4l1-5s2 2 4 6z" />
  </svg>
);
const BALLOON = (
  <svg viewBox="0 0 40 90" aria-hidden>
    <ellipse cx="20" cy="22" rx="16" ry="20" fill="currentColor" />
    <path d="M20 42c-3 10 3 18 0 28s3 14 0 20" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
const BOAT = (
  <svg viewBox="0 0 260 60" fill="currentColor" aria-hidden>
    <path d="M0 38c40 10 180 10 230-6 10-4 18-16 22-30l6 2c-4 18-12 32-28 40C180 60 40 58 0 44z" />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M${30 + i * 20} 38l-6 -14 3 -1 6 15`} />
    ))}
  </svg>
);

function Flyer({ kind, ink, tints }: { kind: IntroFlyer; ink: string; tints: readonly string[] }) {
  switch (kind) {
    case "sleigh":
      return (
        <div className="occi-fly occi-sleigh" style={{ color: ink, filter: "drop-shadow(0 0 12px rgba(255,255,255,.35))" }}>
          <span className="occi-trail" />
          {SLEIGH}
        </div>
      );
    case "kite":
      return <div className="occi-fly occi-kite" style={{ color: tints[1] ?? ink }}>{KITE}</div>;
    case "boat":
      return <div className="occi-fly occi-boat" style={{ color: ink }}>{BOAT}</div>;
    case "lanterns":
    case "balloons":
    case "bats": {
      const n = kind === "bats" ? 5 : 6;
      return (
        <>
          {Array.from({ length: n }, (_, i) => (
            <div
              key={i}
              className={`occi-fly ${kind === "bats" ? "occi-bat" : "occi-lantern"}`}
              style={
                {
                  "--x": `${8 + (i / n) * 84 + rand(i, 11) * 6}%`,
                  "--y": `${20 + rand(i, 12) * 50}%`,
                  "--s": `${kind === "bats" ? 46 + rand(i, 13) * 30 : 34 + rand(i, 13) * 26}px`,
                  "--t": `${3 + rand(i, 14)}s`,
                  "--d": `${rand(i, 15) * 0.9}s`,
                  color: kind === "bats" ? ink : tints[i % tints.length],
                  filter: kind === "lanterns" ? "drop-shadow(0 0 14px rgba(255,214,120,.7))" : undefined,
                } as CSSProperties
              }
            >
              {kind === "bats" ? BAT : kind === "lanterns" ? LANTERN : BALLOON}
            </div>
          ))}
        </>
      );
    }
  }
}

/**
 * The festival's opening screen: a full-screen scene (falling snow and
 * Santa's sleigh at Christmas, fireworks at Diwali…) that plays when a guest
 * opens the site, then fades away. It plays while the owner keeps the
 * occasion switched on, once per visit; "Skip" or Esc closes it at once.
 * Guests who ask for reduced motion don't get it (the banner remains).
 */
export function OccasionIntro({
  definition,
  title,
  live = true,
}: {
  definition: OccasionDefinition;
  /** The banner wording shown under the animation. */
  title: string;
  /** Live site: once per visit. Studio preview: every time the occasion changes. */
  live?: boolean;
}) {
  const scene = OCCASION_INTROS[definition.id] ?? { particles: "sparkles" as const };
  const [phase, setPhase] = useState<"hidden" | "show" | "out">("hidden");
  const storageKey = `occ-intro-${definition.id}`;

  // Decide on the client only (reduced motion, already seen this visit), so server HTML never includes it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (live) {
      try {
        if (window.sessionStorage.getItem(storageKey)) return;
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        /* storage blocked: still play */
      }
    }
    const start = window.setTimeout(() => setPhase("show"), 0);
    const out = window.setTimeout(() => setPhase("out"), INTRO_DURATION_MS);
    const gone = window.setTimeout(() => setPhase("hidden"), INTRO_DURATION_MS + 600);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(out);
      window.clearTimeout(gone);
    };
  }, [definition.id, live, storageKey]);

  useEffect(() => {
    if (phase !== "show") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPhase("out");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const backdrop = useMemo(() => {
    const [a, b] = definition.tints;
    return `radial-gradient(120% 90% at 50% 40%, ${a} 0%, color-mix(in srgb, ${a} 70%, #000) 70%), ${b ?? a}`;
  }, [definition.tints]);

  if (phase === "hidden") return null;

  const content: ReactNode = (
    <>
      <style>{CSS}</style>
      <div aria-hidden className="absolute inset-0">
        <Particles kind={scene.particles} tints={definition.tints.slice(1).concat(definition.tints[0])} />
        {scene.flyer ? <Flyer kind={scene.flyer} ink={definition.ink} tints={definition.tints} /> : null}
      </div>
      <div className="occi-centre" style={{ color: definition.ink }}>
        {definition.lottie ? (
          <div className="size-28 sm:size-36" aria-hidden>
            <SiteLottie name={definition.lottie as LottieId} color={definition.tints[1] ?? definition.ink} className="h-full w-full" />
          </div>
        ) : null}
        <p className="max-w-[22ch] text-3xl font-semibold leading-tight sm:text-5xl" style={{ fontFamily: "var(--site-font-display, Georgia, 'Times New Roman', serif)", textWrap: "balance", textShadow: "0 2px 18px rgba(0,0,0,.45)" } as CSSProperties}>
          {title}
        </p>
      </div>
      <button
        type="button"
        className="occi-skip"
        onClick={() => setPhase("out")}
        style={{ color: definition.ink, background: "rgba(0,0,0,.25)", border: `1px solid ${definition.ink}55` }}
      >
        Skip
      </button>
    </>
  );

  return (
    <div className={`occi ${phase === "out" ? "out" : ""}`} style={{ background: backdrop }} role="presentation" data-occasion-intro={definition.id}>
      {content}
    </div>
  );
}
