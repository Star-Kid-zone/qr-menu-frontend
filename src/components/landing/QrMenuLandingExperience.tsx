"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { PiArrowRightBold, PiChartLineUpBold, PiCheckCircleFill, PiStarFill } from "react-icons/pi";
import { useRef, useState } from "react";
import { routes } from "@/config/routes";

type Chapter = {
  number: string;
  label: string;
  title: string;
  copy: string;
  color: string;
};

const CHAPTERS: Chapter[] = [
  { number: "01", label: "THE ENTRY POINT", title: "A QR code that opens a better table.", copy: "Every guest journey starts with one polished, branded scan — on the table, receipt, window, or campaign.", color: "#6d5dfc" },
  { number: "02", label: "DIGITAL MENU", title: "A menu that changes as quickly as service does.", copy: "Update dishes, availability, photography, tags, timings, and themes without reprinting anything.", color: "#1e8f79" },
  { number: "03", label: "REVIEWS", title: "Let your happiest guests set the tone.", copy: "Bring your latest Google reviews into the guest experience, where trust is most useful.", color: "#e2753d" },
  { number: "04", label: "RESTAURANT SITE", title: "Build a home for your restaurant, not another link.", copy: "Your menu becomes a full public site with search-ready details, stories, offers, and a recognisable identity.", color: "#3578db" },
  { number: "05", label: "PAYMENTS", title: "One last tap. No awkward wait for the bill.", copy: "Put the payment method you already use behind a clear, mobile-first pay action.", color: "#9b5de5" },
  { number: "06", label: "ANALYTICS", title: "See what happens after the scan.", copy: "Learn what guests open, search for, and return to — then make your next move with confidence.", color: "#d7a51d" },
  { number: "07", label: "MARKETING", title: "Give them a reason to come back this week.", copy: "Create offers, loyalty moments, and scroll-stopping posters from the same workspace that runs your menu.", color: "#e24d71" },
];

const QR_CELLS = Array.from({ length: 19 * 19 }, (_, index) => {
  const row = Math.floor(index / 19);
  const col = index % 19;
  const finder = (row < 5 && col < 5) || (row < 5 && col > 13) || (row > 13 && col < 5);
  return finder || ((row * 7 + col * 11 + row * col) % 5 < 2);
});

function QrMark() {
  return <div className="grid aspect-square w-full grid-cols-[repeat(19,minmax(0,1fr))] gap-[2px] bg-white p-3">{QR_CELLS.map((filled, index) => <span key={index} className={filled ? "bg-[#17202e]" : "bg-transparent"} />)}</div>;
}

function ProductScreen({ chapter }: { chapter: number }) {
  const active = CHAPTERS[chapter];
  return (
    <AnimatePresence mode="wait">
      <motion.div key={active.number} initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 1.03 }} transition={{ duration: 0.32 }} className="h-full w-full overflow-hidden rounded-[1.65rem] bg-[#fcfcfb] p-4 text-[#17202e] shadow-[0_20px_55px_rgba(20,32,46,0.20)] sm:p-5">
        {chapter === 0 && <div className="flex h-full flex-col items-center justify-center gap-3"><div className="w-36 rounded-xl p-2 shadow-sm"><QrMark /></div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d5dfc]">Cedar &amp; Spice</p><p className="text-sm font-medium">Scan to explore</p></div>}
        {chapter === 1 && <div className="h-full"><div className="flex items-center justify-between"><span className="font-serif text-lg">Cedar &amp; Spice</span><span className="rounded-full bg-[#e7f5f0] px-2 py-1 text-[8px] font-bold text-[#1e8f79]">OPEN</span></div><p className="mt-3 text-[9px] uppercase tracking-[0.18em] text-[#87909b]">Chef&apos;s favourites</p><div className="mt-2 space-y-2">{["Burnt garlic ramen", "Tandoori cauliflower", "Miso caramel tart"].map((dish, index) => <div key={dish} className="flex items-center justify-between rounded-xl bg-[#f4f6f7] px-3 py-2"><span className="text-[10px] font-semibold">{dish}</span><span className="text-[10px]">₹{[420, 360, 240][index]}</span></div>)}</div></div>}
        {chapter === 2 && <div className="flex h-full flex-col justify-center"><div className="flex items-center gap-1 text-[#e2753d]">{Array.from({ length: 5 }, (_, index) => <PiStarFill key={index} size={15} />)}</div><p className="mt-3 font-serif text-xl leading-tight">“The menu was beautiful and the staff even better.”</p><div className="mt-4 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0d8c8] text-[9px] font-bold">AM</span><span className="text-[10px] font-bold">Ananya M. · Google</span></div></div>}
        {chapter === 3 && <div className="h-full"><div className="h-16 rounded-xl bg-[#3578db] p-3 text-white"><span className="font-serif text-sm">Cedar &amp; Spice</span><p className="mt-1 text-[8px] text-white/70">Modern Indian kitchen</p></div><div className="mt-3 grid grid-cols-2 gap-2"><div className="h-20 rounded-xl bg-[#f1eee7]" /><div className="space-y-2 pt-2"><span className="block h-2 w-full rounded bg-[#dfe6ef]" /><span className="block h-2 w-4/5 rounded bg-[#dfe6ef]" /><span className="block h-2 w-3/5 rounded bg-[#dfe6ef]" /></div></div><p className="mt-3 text-[10px] font-semibold">A neighbourhood table, open every day.</p></div>}
        {chapter === 4 && <div className="flex h-full flex-col justify-center"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b5de5]">Your table · ₹1,840</p><p className="mt-3 font-serif text-2xl">Ready when you are.</p><button type="button" className="mt-5 rounded-xl bg-[#17202e] px-4 py-3 text-left text-[11px] font-bold text-white">Pay your bill <span className="float-right">→</span></button><p className="mt-3 text-center text-[9px] text-[#87909b]">Secure payment link</p></div>}
        {chapter === 5 && <div className="h-full"><div className="flex items-baseline justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#87909b]">Menu opens</p><p className="mt-1 text-2xl font-bold">1,248</p></div><span className="rounded-full bg-[#fff4d5] px-2 py-1 text-[9px] font-bold text-[#a57000]">+18.4%</span></div><div className="mt-5 flex h-28 items-end gap-2">{[44, 68, 52, 82, 61, 96, 76].map((height, index) => <span key={index} className="flex-1 rounded-t-md bg-[#dce5f6]" style={{ height: `${height}%`, backgroundColor: index === 5 ? "#d7a51d" : undefined }} />)}</div><p className="mt-3 text-[9px] text-[#87909b]">Your guests searched “gluten free” 34 times this week.</p></div>}
        {chapter === 6 && <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-[#e24d71] p-4 text-white"><span className="w-fit rounded-full border border-white/40 px-2 py-1 text-[8px] font-bold uppercase tracking-wider">Friday special</span><div><p className="font-serif text-3xl leading-none">Date night,<br />done right.</p><p className="mt-2 text-[10px] text-white/80">Two courses + dessert · ₹1,299</p></div><span className="text-[9px] font-bold uppercase tracking-[0.18em]">Book a table →</span><span className="absolute -right-6 -top-8 h-28 w-28 rounded-full border-[18px] border-[#f6a9bb]" /></div>}
      </motion.div>
    </AnimatePresence>
  );
}

function Journey() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [chapter, setChapter] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (progress) => setChapter((current) => {
    const next = Math.min(CHAPTERS.length - 1, Math.floor(progress * CHAPTERS.length));
    return current === next ? current : next;
  }));

  return <section ref={ref} id="platform" className="relative bg-[#f2f6fa] text-[#17202e]">
    <div className="sticky top-0 z-0 flex h-[100svh] items-center justify-center overflow-hidden px-6">
      <motion.div animate={reduceMotion ? undefined : { rotate: chapter % 2 ? -7 : 7, y: chapter % 2 ? -10 : 10 }} transition={{ type: "spring", stiffness: 35, damping: 16 }} className="relative w-[min(21rem,78vw)] sm:w-[25rem]">
        <div className="absolute -left-10 top-10 h-20 w-20 rounded-full bg-[#f5c4cf] blur-2xl" />
        <div className="absolute -right-8 bottom-3 h-24 w-24 rounded-full bg-[#b9dfd5] blur-2xl" />
        <div className="relative aspect-[0.72] rounded-[2.2rem] border-[8px] border-[#17202e] bg-[#17202e] p-1 shadow-[0_32px_70px_rgba(21,42,61,0.20)]"><ProductScreen chapter={chapter} /></div>
      </motion.div>
      <div className="absolute bottom-7 font-mono text-[10px] font-bold tracking-[0.22em] text-[#657080]">{CHAPTERS[chapter].number} / 07</div>
    </div>
    <div className="relative z-10 -mt-[100svh]">
      {CHAPTERS.map((item, index) => <article key={item.number} className="flex min-h-[100svh] items-end px-6 pb-20 sm:items-center sm:px-14 sm:pb-0"><div className={`max-w-sm ${index % 2 === 0 ? "sm:mr-auto" : "sm:ml-auto"}`}><p className="text-[10px] font-bold tracking-[0.18em]" style={{ color: item.color }}>{item.number} · {item.label}</p><h2 className="mt-5 font-serif text-5xl leading-[0.92] tracking-[-0.045em] sm:text-7xl">{item.title}</h2><p className="mt-6 text-base leading-relaxed text-[#566271] sm:text-lg">{item.copy}</p></div></article>)}
    </div>
  </section>;
}

export function QrMenuLandingExperience() {
  return <main className="min-h-screen overflow-x-hidden bg-[#fbfaf7] text-[#17202e]">
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 sm:px-12">
      <Link href="/" className="font-serif text-2xl tracking-tight">qrmenu<span className="text-[#6d5dfc]">.</span></Link>
      <div className="flex items-center gap-2.5 sm:gap-4">
        <a href="#platform" className="hidden text-xs font-bold uppercase tracking-[0.14em] text-[#566271] sm:block">How it works</a>
        <Link href={routes.public.login} className="px-3 py-2 text-xs font-bold text-[#566271] transition-colors hover:text-[#17202e]">Log in</Link>
        <Link href={routes.public.register} className="rounded-full bg-[#17202e] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(23,32,46,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6d5dfc]">Register</Link>
      </div>
    </header>
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-16 pt-28 sm:px-12">
      <div className="absolute -right-24 top-12 h-[36rem] w-[36rem] rounded-full bg-[#dbe8ff] blur-3xl" /><div className="absolute -bottom-32 -left-20 h-[32rem] w-[32rem] rounded-full bg-[#f9dec9] blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6d5dfc]">Restaurant operating system</p>
          <h1 className="mt-5 max-w-3xl font-serif text-[clamp(4rem,8vw,8.5rem)] leading-[0.78] tracking-[-0.07em]">The table is just the beginning.</h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#566271]">A single scan that moves guests from choosing dinner to coming back for more.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={routes.public.register} className="inline-flex items-center gap-2 rounded-full bg-[#6d5dfc] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_rgba(109,93,252,0.26)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(109,93,252,0.36)]">Register your restaurant <PiArrowRightBold /></Link>
            <a href="#platform" className="inline-flex items-center gap-2 rounded-full border border-[#bfc9d4] px-6 py-3.5 text-sm font-bold transition-colors hover:bg-black/5">See how it works</a>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9, rotate: 8 }} animate={{ opacity: 1, scale: 1, rotate: 4 }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }} className="relative mx-auto w-[min(22rem,80vw)]"><div className="absolute -left-9 top-12 rounded-2xl bg-white px-4 py-3 shadow-xl"><p className="text-[9px] font-bold uppercase tracking-wider text-[#1e8f79]">Live menu</p><p className="mt-1 text-xs font-bold">Kitchen is open</p></div><div className="rounded-[2.5rem] bg-[#17202e] p-3 shadow-[0_35px_70px_rgba(23,32,46,0.25)]"><div className="rounded-[2rem] bg-[#f7f8f6] p-7"><QrMark /><p className="mt-5 text-center font-serif text-xl">Cedar &amp; Spice</p><p className="mt-1 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#6d5dfc]">Point your camera here</p></div></div></motion.div>
      </div>
    </section>
    <section className="border-y border-[#d9e0e7] bg-white px-6 py-6 sm:px-12"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 text-xs font-bold uppercase tracking-[0.12em] text-[#657080]"><span>One connected guest experience</span><span className="flex items-center gap-2 text-[#1e8f79]"><PiCheckCircleFill /> Made for independent restaurants</span><span className="flex items-center gap-2 text-[#d7a51d]"><PiChartLineUpBold /> See every useful signal</span></div></section>
    <Journey />
    <section className="bg-[#17202e] px-6 py-24 text-white sm:px-12 sm:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b9dfd5]">A better guest experience starts here</p>
        <h2 className="mt-5 font-serif text-5xl leading-[0.88] tracking-[-0.05em] sm:text-7xl">Run the restaurant.<br />Not seven disconnected tools.</h2>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href={routes.public.register} className="inline-flex items-center gap-2 rounded-full bg-[#b9dfd5] px-6 py-3.5 text-sm font-bold text-[#17202e] transition-transform hover:-translate-y-0.5">Register now <PiArrowRightBold /></Link>
          <Link href={routes.public.login} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10">Sign in to workspace</Link>
        </div>
      </div>
    </section>
    <footer className="flex flex-col gap-4 bg-[#17202e] px-6 pb-8 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-12"><span>© {new Date().getFullYear()} QRMenu</span><span>Menus · websites · payments · growth</span></footer>
  </main>;
}
