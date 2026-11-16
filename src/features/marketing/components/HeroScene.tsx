"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PiStarFill, PiEyeSlashBold, PiTrendUpBold } from "react-icons/pi";
import { MenuScreen, Phone } from "./PhoneScreens";
import { QrPattern } from "./QrMark";

/*
 * The hero illustration: a printed table card and the phone a guest holds
 * after scanning it, on the plum "table top". Layers move at different
 * speeds as the page scrolls (parallax), and the small chips show things the
 * dashboard really does to the live menu: sold out, a new review, visits.
 */

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const phoneY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [-7, reduce ? -7 : -12]);
  const chipAY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -150]);
  const chipBY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const chipCY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const haloScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.25]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[33rem] w-full max-w-[34rem] sm:h-[36rem]"
      role="img"
      aria-label="A printed table card with a QR code next to the menu a guest sees on their phone after scanning it"
    >
      {/* Soft saffron halo behind the scene */}
      <motion.div
        aria-hidden
        style={{ scale: haloScale }}
        className="absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
      >
        <div className="size-full rounded-full" style={{ background: "radial-gradient(circle, rgb(242 179 61 / 0.35), rgb(91 46 133 / 0.25) 55%, transparent 70%)" }} />
      </motion.div>

      {/* Table card */}
      <div className="mkt-rise mkt-rise-3 absolute left-0 top-16 w-36 sm:left-2 sm:top-24 sm:w-52">
        <motion.div style={{ y: cardY, rotate: cardRotate }} className="mkt-tablecard p-4 text-center sm:p-5">
          <p className="text-[0.6875rem] font-semibold tracking-tight">Annapoorna Kitchen</p>
          <QrPattern className="mx-auto my-3 w-full" ink="var(--m-ink)" />
          <p className="mkt-h3 text-base">Scan for our menu</p>
          <p className="mt-1 text-[0.625rem]" style={{ color: "var(--m-mute)" }}>Table 7</p>
        </motion.div>
      </div>

      {/* Phone */}
      <div className="mkt-rise mkt-rise-2 absolute right-0 top-6 sm:right-2 sm:top-8">
        <motion.div style={{ y: phoneY }}>
          <Phone className="w-[14rem] sm:w-[17.5rem]">
            <MenuScreen />
          </Phone>
        </motion.div>
      </div>

      {/* Live chips */}
      <div className="mkt-rise mkt-rise-4 absolute left-2 top-2 sm:left-6 sm:top-6">
        <motion.div style={{ y: chipAY }} className="mkt-chip">
          <span className="flex size-5 items-center justify-center rounded-full" style={{ background: "#fdf0d2", color: "#7a5100" }}>
            <PiStarFill className="size-3" aria-hidden />
          </span>
          New Google review, 5 stars
        </motion.div>
      </div>
      <div className="mkt-rise mkt-rise-4 absolute bottom-10 left-0 sm:bottom-16 sm:left-4">
        <motion.div style={{ y: chipBY }} className="mkt-chip">
          <span className="flex size-5 items-center justify-center rounded-full" style={{ background: "#ece9f1", color: "var(--m-mute)" }}>
            <PiEyeSlashBold className="size-3" aria-hidden />
          </span>
          Mutton biryani marked sold out
        </motion.div>
      </div>
      <div className="mkt-rise mkt-rise-4 absolute bottom-0 right-6 hidden sm:block">
        <motion.div style={{ y: chipCY }} className="mkt-chip">
          <span className="flex size-5 items-center justify-center rounded-full" style={{ background: "#e3f3ea", color: "#1f6b45" }}>
            <PiTrendUpBold className="size-3" aria-hidden />
          </span>
          142 menu opens today
        </motion.div>
      </div>
    </div>
  );
}
