import { cn } from "@/utils/cn";

interface MarqueeProps {
  text: string;
  className?: string;
  reverse?: boolean;
  durationS?: number;
}

/** Infinite scrolling text band — the content is duplicated once and the
 * whole flex row is animated by exactly -50%, which is the seamless-loop
 * trick (each copy is the same width, so the loop point is invisible). */
export function Marquee({ text, className, reverse = false, durationS = 26 }: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn("flex w-max items-center gap-10", reverse ? "animate-marquee-reverse" : "animate-marquee")}
        style={{ animationDuration: `${durationS}s` }}
      >
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center gap-10" aria-hidden={group === 1}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="whitespace-nowrap font-display text-5xl uppercase tracking-tight sm:text-7xl">
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
