"use client";

import {
  Children,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Motion kit (docs/site-system/PLAN.md §3 rule 6).
 *
 * - One orchestrated moment per layout (curtain, line reveal, wipe, sweep) is
 *   plain CSS: it starts with the first paint, needs no JavaScript, and every
 *   animation's resting state is the finished state — so with reduced motion,
 *   the owner's "motion off", or no CSS animation support, content simply shows.
 * - Everything else answers the visitor (hover, pointer, scroll) or plays once
 *   when it comes into view.
 * - Only transform / opacity / clip-path are animated.
 * - `--site-tempo` (1 calm … 1.6 lively) shortens durations and lengthens travel.
 */

const DUR = "calc(var(--sk-d, 900ms) * (1.3 - 0.3 * var(--site-tempo, 1)))";
const EASE = "cubic-bezier(.2,.8,.2,1)";

export const MOTION_CSS = `
.sk-mask{display:inline-block;overflow:hidden;vertical-align:top;padding-block:.1em;margin-block:-.1em}
.sk-rise{display:inline-block;animation:sk-rise ${DUR} ${EASE} both;animation-delay:calc(var(--sk-delay,0ms) + var(--i,0) * 90ms)}
@keyframes sk-rise{from{transform:translateY(108%)}to{transform:none}}
.sk-fade{animation:sk-fade ${DUR} ease-out both;animation-delay:var(--sk-delay,0ms)}
@keyframes sk-fade{from{opacity:0}to{opacity:1}}
.sk-wipe{animation:sk-wipe calc(${DUR} * 1.3) ${EASE} both;animation-delay:var(--sk-delay,0ms)}
@keyframes sk-wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
.sk-curtain{position:absolute;inset:0;z-index:30;pointer-events:none;overflow:hidden}
.sk-curtain>span{position:absolute;top:0;bottom:0;width:50.5%;animation-duration:calc(${DUR} * 1.25);animation-timing-function:cubic-bezier(.7,0,.2,1);animation-fill-mode:both;animation-delay:var(--sk-delay,250ms)}
.sk-curtain>span:first-child{left:0;transform:translateX(-101%);animation-name:sk-part-l}
.sk-curtain>span:last-child{right:0;transform:translateX(101%);animation-name:sk-part-r}
@keyframes sk-part-l{from{transform:none}to{transform:translateX(-101%)}}
@keyframes sk-part-r{from{transform:none}to{transform:translateX(101%)}}
.sk-sweep{position:absolute;inset:-10% -60%;pointer-events:none;transform:translateX(70%);opacity:0;animation:sk-sweep calc(${DUR} * 2.6) cubic-bezier(.45,.05,.3,1) both;animation-delay:var(--sk-delay,300ms)}
@keyframes sk-sweep{0%{transform:translateX(-70%);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translateX(70%);opacity:0}}
.sk-slide-r{transform:translateX(102%);animation:sk-slide-r calc(${DUR} * 1.4) cubic-bezier(.65,0,.25,1) both;animation-delay:var(--sk-delay,300ms)}
@keyframes sk-slide-r{from{transform:none}to{transform:translateX(102%)}}
.sk-slide-in{animation:sk-slide-in calc(${DUR} * 1.1) ${EASE} both;animation-delay:var(--sk-delay,0ms)}
@keyframes sk-slide-in{from{transform:translateX(-24px);opacity:0}to{transform:none;opacity:1}}
.sk-wave{animation:sk-wave var(--sk-wave,14s) linear infinite}
@keyframes sk-wave{to{transform:translateX(-50%)}}
.sk-bob{animation:sk-bob 6s ease-in-out infinite}
@keyframes sk-bob{50%{transform:translateY(calc(-6px * var(--site-tempo,1)))}}
.sk-tile-out{transform:scale(0);opacity:0;animation:sk-tile-out calc(${DUR} * .7) ${EASE} both;animation-delay:calc(var(--sk-delay,150ms) + var(--i,0) * 28ms)}
@keyframes sk-tile-out{from{transform:none;opacity:1}to{transform:scale(0);opacity:0}}
.sk-fan{transform-origin:50% 100%;animation:sk-fan calc(${DUR} * .9) ${EASE} both;animation-delay:calc(var(--sk-delay,200ms) + var(--i,0) * 70ms)}
@keyframes sk-fan{from{transform:rotate(var(--fold,0deg)) scaleY(.2);opacity:0}to{transform:none;opacity:1}}
.sk-flicker{animation:sk-flicker 1.6s steps(1,end) both;animation-delay:var(--sk-delay,400ms)}
@keyframes sk-flicker{0%{opacity:.15}8%{opacity:1}12%{opacity:.3}18%{opacity:1}40%{opacity:.55}44%{opacity:1}100%{opacity:1}}
.sk-flip{transform-origin:50% 0;animation:sk-flip calc(${DUR} * .8) ${EASE} both}
@keyframes sk-flip{from{transform:perspective(900px) rotateX(-70deg);opacity:0}to{transform:none;opacity:1}}
.sk-marquee{display:flex;width:max-content;animation:sk-marquee var(--sk-marquee,48s) linear infinite}
.sk-marquee[data-paused],.sk-marquee:hover{animation-play-state:paused}
@keyframes sk-marquee{to{transform:translateX(-50%)}}
.sk-lift{transition:transform calc(${DUR} * .45) ${EASE}}
.sk-lift:hover{transform:translateY(calc(-3px * var(--site-tempo,1)))}
.sk-zoom{transition:transform calc(${DUR} * 1.1) ${EASE}}
.group:hover .sk-zoom,.sk-zoom:hover{transform:scale(1.04)}
@media (prefers-reduced-motion: reduce){
  .sk-rise,.sk-fade,.sk-wipe,.sk-curtain>span,.sk-sweep,.sk-marquee,.sk-slide-r,.sk-slide-in,.sk-wave,.sk-bob,.sk-tile-out,.sk-fan,.sk-flicker,.sk-flip{animation:none!important}
  .sk-lift:hover,.group:hover .sk-zoom,.sk-zoom:hover{transform:none}
}
[data-motion="off"] .sk-rise,[data-motion="off"] .sk-fade,[data-motion="off"] .sk-wipe,
[data-motion="off"] .sk-curtain>span,[data-motion="off"] .sk-sweep,[data-motion="off"] .sk-marquee,
[data-motion="off"] .sk-slide-r,[data-motion="off"] .sk-slide-in,[data-motion="off"] .sk-wave,[data-motion="off"] .sk-bob,
[data-motion="off"] .sk-tile-out,[data-motion="off"] .sk-fan,[data-motion="off"] .sk-flicker,[data-motion="off"] .sk-flip{animation:none!important}
`;

/** Loaded once per page (React dedupes by href). */
export function MotionStyles() {
  return (
    <style href="site-motion-kit" precedence="default">
      {MOTION_CSS}
    </style>
  );
}

/** True when the visitor or the owner asked for no motion. Client-only check; false during SSR. */
function motionBlocked(el: Element | null): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  return Boolean(el?.closest('[data-motion="off"]'));
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ───────────────────────── line / word reveal ───────────────────────── */

/**
 * A headline whose words rise into place one after another — on wrap this
 * reads as the headline "setting" line by line. The text is ordinary text
 * (selectable, read normally by screen readers).
 */
export function LineReveal({
  text,
  as: Tag = "h1",
  id,
  className,
  style,
  delayMs = 0,
}: {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
  delayMs?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag id={id} className={className} style={{ ...style, ["--sk-delay" as string]: `${delayMs}ms` }}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="sk-mask">
            <span className="sk-rise" style={{ ["--i" as string]: i } as CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/** Two panels that part to open the scene (curtain). Place inside a `relative` box. */
export function Curtain({ color, delayMs = 250 }: { color: string; delayMs?: number }) {
  return (
    <div aria-hidden className="sk-curtain" style={{ ["--sk-delay" as string]: `${delayMs}ms` } as CSSProperties}>
      <span style={{ background: color }} />
      <span style={{ background: color }} />
    </div>
  );
}

/* ───────────────────────── in-view helpers ───────────────────────── */

function useOnceInView<T extends Element>(onEnter: (el: T) => void, rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T>(null);
  const cb = useRef(onEnter);
  useEffect(() => {
    cb.current = onEnter;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          cb.current(el);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}

/**
 * Fades + lifts its children in the first time they scroll into view. Content
 * that is already on screen (or rendered on the server) is never hidden.
 * Use sparingly — the layout's hero is its one big moment.
 */
export function Reveal({ children, className, style, as: Tag = "div", delayMs = 0 }: { children: ReactNode; className?: string; style?: CSSProperties; as?: ElementType; delayMs?: number }) {
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);
  const ref = useOnceInView<HTMLElement>(() => setShown(true));
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || motionBlocked(el)) return;
    // Only things below the fold get hidden, so nothing visible ever blinks.
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [ref]);
  const hidden = armed && !shown;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(calc(18px * var(--site-tempo, 1)))" : "none",
        transition: armed ? `opacity 700ms ${EASE} ${delayMs}ms, transform 700ms ${EASE} ${delayMs}ms` : undefined,
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * A stat that counts up once when it scrolls into view. The server renders
 * the final text; the count only rewrites the number in place (no layout
 * shift: tabular figures). Years (1800–2100) and non-numbers are left alone.
 */
export function Counter({ value, className, style }: { value: string; className?: string; style?: CSSProperties }) {
  const ref = useOnceInView<HTMLSpanElement>((el) => {
    const m = value.match(/^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!m || motionBlocked(el)) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(",", "."));
    const decimals = (num.split(/[.,]/)[1] ?? "").length;
    if (!Number.isFinite(target) || target === 0 || (decimals === 0 && target >= 1800 && target <= 2100)) return;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = `${pre}${(target * eased).toFixed(decimals)}${post}`;
      if (k < 1) requestAnimationFrame(tick);
      else el.textContent = value;
    };
    requestAnimationFrame(tick);
  });
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {value}
    </span>
  );
}

/** Moves its content slowly against the scroll (depth). Transform only; still for reduced motion. */
export function Parallax({ children, amount = 60, className, style }: { children: ReactNode; amount?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount / 2, amount / 2]);
  return (
    <div ref={ref} className={className} style={{ ...style, overflow: "hidden" }}>
      <motion.div style={{ y, height: "100%", scale: reduce ? 1 : 1 + amount / 900 }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * A horizontal band that scrolls forever. The second copy is hidden from
 * screen readers; it pauses on hover and while off screen.
 */
export function MarqueeTrack({ children, seconds = 48, className, style }: { children: ReactNode; seconds?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.removeAttribute("data-paused");
      else el.setAttribute("data-paused", "");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const items = Children.toArray(children);
  return (
    <div className={`overflow-hidden ${className ?? ""}`} style={style}>
      <div ref={ref} className="sk-marquee" style={{ ["--sk-marquee" as string]: `${seconds}s` } as CSSProperties}>
        <div className="flex shrink-0 items-center">{items}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {items}
        </div>
      </div>
    </div>
  );
}

/** Leans gently towards the pointer (fine pointers only). Wrap a button or link. */
export function Magnetic({ children, strength = 8, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || motionBlocked(el)) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength * 0.6).toFixed(1)}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`inline-block transition-transform duration-300 ease-out ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
