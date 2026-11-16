"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { GUEST_SCREENS } from "../content";
import { MenuScreen, PayScreen, Phone, WebsiteScreen } from "./PhoneScreens";
import { cn } from "@/utils/cn";

/*
 * Scroll-driven walkthrough of what a guest gets after one scan. The phone
 * stays pinned while the three explanations scroll past; the screen on the
 * phone changes to match the one in view.
 */

const SCREENS = {
  menu: MenuScreen,
  website: WebsiteScreen,
  pay: PayScreen,
} as const;

export function GuestJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(GUEST_SCREENS.length - 1, Math.max(0, Math.floor(p * GUEST_SCREENS.length)));
    if (next !== active) setActive(next);
  });

  const Screen = SCREENS[GUEST_SCREENS[active].id];

  return (
    <div ref={ref} className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      {/* Pinned phone */}
      <div className="hidden lg:block">
        <div className="sticky top-28 flex justify-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 rounded-[3rem] opacity-80 blur-2xl"
              style={{ background: "radial-gradient(circle at 50% 40%, rgb(242 179 61 / 0.35), rgb(91 46 133 / 0.12) 55%, transparent 72%)" }}
            />
            <Phone>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={GUEST_SCREENS[active].id}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Screen />
                </motion.div>
              </AnimatePresence>
            </Phone>
          </div>
        </div>
      </div>

      {/* Explanations */}
      <ol className="space-y-10 lg:space-y-0">
        {GUEST_SCREENS.map((s, i) => {
          const Small = SCREENS[s.id];
          return (
            <li key={s.id} className="lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center">
              <div
                className={cn("transition-opacity duration-300 lg:opacity-40", i === active && "lg:opacity-100")}
                aria-current={i === active ? "step" : undefined}
              >
                <span className="mkt-tag mkt-tag-saffron">After one scan</span>
                <h3 className="mkt-h3 mt-3 text-2xl">{s.title}</h3>
                <p className="mkt-body mt-3 max-w-md">{s.body}</p>
              </div>
              {/* Mobile and tablet: a small static phone under each explanation */}
              <div className="mt-6 flex justify-center lg:hidden">
                <Phone className="w-[14rem]">
                  <Small />
                </Phone>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
