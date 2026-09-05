"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronDown, LuCircleHelp } from "react-icons/lu";

const FAQS = [
  {
    question: "Do guests need to download an app or register an account to order?",
    answer:
      "No, never. Guests simply point their iPhone or Android camera at the QR code and the digital menu opens instantly in Safari or Chrome in under 1 second. Zero downloads, zero friction.",
  },
  {
    question: "What hardware or POS terminals do we need to get started?",
    answer:
      "None. QRMenu runs completely in the cloud. You can manage menus, view live orders, and check analytics from any phone, iPad, tablet, or laptop you already own in your restaurant.",
  },
  {
    question: "Can every dining table have its own unique QR code?",
    answer:
      "Yes! The QR Code Studio generates unique codes for Table 01, Table 02, etc. When a diner scans, the system automatically pins their cart and payments to that exact table number so staff never deliver to the wrong seat.",
  },
  {
    question: "How fast can we update out-of-stock (86'd) dishes and daily specials?",
    answer:
      "In about 3 seconds. Toggle 'Out of Stock' or change a price in your manager dashboard, and it reflects immediately across all guest devices with live sync. You never have to reprint menus or send servers to apologize.",
  },
  {
    question: "How does the Google Review Booster work?",
    answer:
      "During or after their meal, guests can leave feedback directly on the menu. 5-star experiences are seamlessly redirected to your Google Maps review page, while any concerns are routed privately to management so you can resolve them before the guest leaves.",
  },
  {
    question: "Can we use our own custom domain and restaurant branding?",
    answer:
      "Absolutely. Every restaurant gets their own branded portal (e.g. sunset-bistro.qrmenu.com) with customizable themes, typography, brand colors, chef biographies, and opening hours.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-400 mb-3">
          <LuCircleHelp className="h-3.5 w-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight">
          Everything you need to know.
        </h2>
        <p className="mt-3 text-base text-zinc-400">
          Got questions about upgrading your restaurant to QRMenu? We&apos;ve got answers.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl transition-colors hover:border-white/20"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between p-5 sm:p-6 text-left"
              >
                <span className="text-base sm:text-lg font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-zinc-400"
                >
                  <LuChevronDown className="h-5 w-5" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
