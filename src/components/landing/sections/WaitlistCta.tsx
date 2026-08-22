import { Reveal } from "../parallax/Reveal";
import { WaitlistForm } from "./WaitlistForm";

export function WaitlistCta() {
  return (
    <section id="waitlist" className="relative bg-[#0d0906] px-5 py-24 text-white xs:px-8 sm:px-12 sm:py-40">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Be first in line</span>
          <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tighter sm:text-8xl">
            Let&apos;s cook
            <br />
            <span className="text-primary">something.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
            Leave your email and we&apos;ll let you know the moment the doors open — no spam, just a launch-day heads up.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-10 w-full max-w-md">
          <WaitlistForm dark />
        </Reveal>
      </div>
    </section>
  );
}
