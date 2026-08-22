import Link from "next/link";
import { PiInstagramLogoBold, PiTiktokLogoBold } from "react-icons/pi";
import { routes } from "@/config/routes";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#0d0906] px-5 pb-8 pt-16 text-white xs:px-8 sm:px-12 sm:pt-24">
      <Link
        href="/"
        data-cursor-hover
        className="block font-display text-[16vw] font-bold uppercase leading-[0.85] tracking-tighter text-white/10 transition-colors hover:text-white/20 sm:text-[11vw]"
      >
        QRMenu
      </Link>

      <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          <a href="#index" data-cursor-hover className="transition-colors hover:text-white">Index</a>
          <a href="#work" data-cursor-hover className="transition-colors hover:text-white">Work</a>
          <a href="#how-it-works" data-cursor-hover className="transition-colors hover:text-white">How it works</a>
          <Link href={routes.public.login} data-cursor-hover className="transition-colors hover:text-white">Admin login</Link>
        </nav>

        <div className="flex items-center gap-4">
          <a href="#" aria-label="Instagram" data-cursor-hover className="text-white/50 transition-colors hover:text-primary">
            <PiInstagramLogoBold size={18} />
          </a>
          <a href="#" aria-label="TikTok" data-cursor-hover className="text-white/50 transition-colors hover:text-primary">
            <PiTiktokLogoBold size={18} />
          </a>
        </div>
      </div>

      <p className="mt-8 font-display text-xs uppercase tracking-widest text-white/30">
        &copy; {new Date().getFullYear()} QRMenu. All rights reserved.
      </p>
    </footer>
  );
}
