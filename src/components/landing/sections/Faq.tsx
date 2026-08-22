"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PiPlusBold } from "react-icons/pi";
import { Reveal } from "../parallax/Reveal";

const FAQS = [
  {
    q: "Do my guests need to download an app?",
    a: "No. Scanning the QR code opens a live web menu in their phone's browser — nothing to install, nothing to sign up for.",
  },
  {
    q: "Do I get my own web address?",
    a: "Yes — every business gets a branded subdomain out of the box (yourname.qrmenu.app), with live availability-checking while you pick it.",
  },
  {
    q: "What if I need to change a price or take a dish off the menu?",
    a: "Edit it in your dashboard and it's live instantly — every guest scanning your QR sees the update immediately, no reprinting.",
  },
  {
    q: "Does it handle payments?",
    a: "You attach a payment link or upload a payment QR — guests get a scannable code on your menu that points to whatever payment setup you already use.",
  },
  {
    q: "How do reviews get onto my page?",
    a: "Connect your Google Business listing once and sync your latest reviews onto your site with a click — no manual copy-pasting.",
  },
  {
    q: "Can I give my staff access without sharing my login?",
    a: "Yes — invite staff with their own phone + password sign-in, scoped to just the menu and workspace sections. Owner-level access stays yours alone.",
  },
] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-[#0d0906] px-5 py-24 text-white xs:px-8 sm:px-12 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-14 sm:mb-20">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/40">FAQ</span>
          <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Questions, answered
          </h2>
        </Reveal>

        <div className="divide-y divide-white/15 border-y border-white/15">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  data-cursor-hover
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-semibold sm:text-xl">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="shrink-0 text-primary"
                  >
                    <PiPlusBold size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 leading-relaxed text-white/60">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
