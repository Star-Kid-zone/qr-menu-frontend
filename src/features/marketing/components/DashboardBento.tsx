import {
  PiCameraBold,
  PiCheckBold,
  PiDownloadSimpleBold,
  PiFacebookLogoBold,
  PiInstagramLogoBold,
  PiLinkedinLogoBold,
  PiXLogoBold,
  PiStarFill,
  PiSparkleBold,
  PiMagnifyingGlassBold,
  PiGlobeSimpleBold,
} from "react-icons/pi";
import { DASHBOARD_AREAS, LOOK_COUNT, ROOT_DOMAIN } from "../content";
import { QrPattern } from "./QrMark";
import { cn } from "@/utils/cn";

/*
 * "What you run from the dashboard": each tile pairs the copy from content.ts
 * with a small illustration of the actual admin screen. Illustrations are
 * static markup, drawn from the real UI (MenuScanModal, Website studio,
 * QR download, review reply queue, social compose, shifts, visits).
 */

type Area = (typeof DASHBOARD_AREAS)[number];
const area = (id: Area["id"]) => DASHBOARD_AREAS.find((a) => a.id === id)!;

function Tile({ a, className, children }: { a: Area; className?: string; children: React.ReactNode }) {
  return (
    <article className={cn("mkt-card flex flex-col overflow-hidden p-6 sm:p-7", className)}>
      <h3 className="mkt-h3">{a.title}</h3>
      <p className="mkt-body mt-2 text-[0.9375rem]">{a.body}</p>
      <div className="mt-6 flex-1">{children}</div>
    </article>
  );
}

function MenuScanMini() {
  const rows = [
    { name: "Mutton chukka", price: "₹320", ok: true },
    { name: "Kothu parotta", price: "₹180", ok: true },
    { name: "Filter coffee", price: "₹40", ok: false },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
      <div className="mkt-mini flex flex-col items-center justify-center gap-2 p-4 text-center" style={{ background: "var(--m-plum-deep)", color: "var(--m-on-plum)", borderColor: "transparent" }}>
        <PiCameraBold className="size-6" style={{ color: "var(--m-saffron)" }} aria-hidden />
        <p className="font-semibold">menu-page-1.jpg</p>
        <span className="mkt-tag mkt-tag-saffron inline-flex items-center gap-1">
          <PiSparkleBold aria-hidden /> Scan with AI
        </span>
      </div>
      <div className="mkt-mini">
        <div className="mkt-mini-row justify-between font-semibold">
          <span>3 dishes found</span>
          <span style={{ color: "var(--m-mute)" }}>Check and add</span>
        </div>
        {rows.map((r) => (
          <div key={r.name} className="mkt-mini-row justify-between">
            <span className="flex items-center gap-2">
              <span className={cn("flex size-4 items-center justify-center rounded border", r.ok ? "border-transparent text-white" : "")} style={r.ok ? { background: "var(--m-brand)" } : { borderColor: "var(--m-line)" }}>
                {r.ok && <PiCheckBold className="size-2.5" aria-hidden />}
              </span>
              {r.name}
            </span>
            <span className="tabular-nums">{r.price}</span>
          </div>
        ))}
        <div className="mkt-mini-row justify-between" style={{ color: "var(--m-mute)" }}>
          <span>Also: CSV import, bulk price change</span>
          <span className="mkt-toggle" aria-hidden />
        </div>
      </div>
    </div>
  );
}

function WebsiteMini() {
  const swatches = ["#3b1d4f", "#f2b33d", "#2f855a", "#d64530", "#1c1526", "#0f5c7a"];
  return (
    <div className="mkt-mini p-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Look</span>
        <span className="mkt-tag mkt-tag-brand">{LOOK_COUNT} looks</span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {["Luxury minimal", "Neo brutalism", "Botanical"].map((l, i) => (
          <span key={l} className="rounded-lg border px-2 py-1.5 text-center text-[0.6875rem] font-medium" style={i === 0 ? { borderColor: "var(--m-brand)", background: "var(--m-brand-soft)", color: "var(--m-brand)" } : { borderColor: "var(--m-line)" }}>
            {l}
          </span>
        ))}
      </div>
      <p className="mt-3 font-semibold">Colours</p>
      <div className="mt-1.5 flex gap-1.5">
        {swatches.map((c, i) => (
          <span key={c} className={cn("size-5 rounded-full", i === 1 && "ring-2 ring-offset-1")} style={{ background: c, ["--tw-ring-color" as string]: "var(--m-brand)" }} aria-hidden />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg px-2.5 py-2" style={{ background: "var(--m-paper)", border: "1px solid var(--m-line)" }}>
        <span className="flex items-center gap-1.5">
          <PiGlobeSimpleBold aria-hidden style={{ color: "var(--m-brand)" }} />
          annapoorna.{ROOT_DOMAIN}
        </span>
        <span className="mkt-tag mkt-tag-leaf">Live</span>
      </div>
    </div>
  );
}

function QrMini() {
  return (
    <div className="flex items-center gap-4">
      <div className="mkt-tablecard w-24 shrink-0 p-2">
        <QrPattern className="w-full" ink="var(--m-ink)" />
      </div>
      <div className="space-y-2 text-xs">
        {["PNG for stickers", "SVG for printers"].map((t) => (
          <span key={t} className="flex items-center gap-2 rounded-full border px-3 py-1.5 font-semibold" style={{ borderColor: "var(--m-line)" }}>
            <PiDownloadSimpleBold aria-hidden style={{ color: "var(--m-brand)" }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReviewsMini() {
  return (
    <div className="mkt-mini p-3">
      <div className="flex items-center gap-1" style={{ color: "var(--m-saffron-deep)" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <PiStarFill key={i} className="size-3" aria-hidden />
        ))}
        <PiStarFill className="size-3 opacity-25" aria-hidden />
        <span className="ml-1 font-semibold" style={{ color: "var(--m-ink)" }}>Karthik M.</span>
        <span className="ml-auto" style={{ color: "var(--m-mute)" }}>Google, 2 h ago</span>
      </div>
      <p className="mt-1.5" style={{ color: "var(--m-mute)" }}>&ldquo;Great dosas. Waited a bit on a Sunday.&rdquo;</p>
      <div className="mt-3 rounded-lg p-2.5" style={{ background: "var(--m-brand-soft)", color: "var(--m-brand)" }}>
        <p className="flex items-center gap-1 font-semibold">
          <PiSparkleBold aria-hidden /> Suggested reply
        </p>
        <p className="mt-1" style={{ color: "var(--m-ink)" }}>Thank you, Karthik. Sundays get busy; we have added a second dosa counter from this week.</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold">Auto-reply to new reviews</span>
        <span className="mkt-toggle" aria-hidden />
      </div>
    </div>
  );
}

function SocialMini() {
  return (
    <div className="mkt-mini p-3">
      <div className="flex gap-1.5">
        {[PiFacebookLogoBold, PiInstagramLogoBold, PiXLogoBold, PiLinkedinLogoBold].map((Icon, i) => (
          <span key={i} className="flex size-7 items-center justify-center rounded-full" style={{ background: i < 2 ? "var(--m-brand)" : "#ece9f1", color: i < 2 ? "#fff" : "var(--m-mute)" }}>
            <Icon className="size-3.5" aria-hidden />
          </span>
        ))}
        <span className="ml-auto mkt-tag mkt-tag-saffron">Weekly poster</span>
      </div>
      <p className="mt-3" style={{ color: "var(--m-ink)" }}>Friday special: ghee roast dosa with three chutneys, 6 pm onwards.</p>
      <div className="mt-3 flex items-center justify-between font-semibold">
        <span style={{ color: "var(--m-mute)" }}>Scheduled for Fri 5:30 pm</span>
        <span className="rounded-full px-2.5 py-1 text-white" style={{ background: "var(--m-brand)" }}>Schedule</span>
      </div>
    </div>
  );
}

function TeamMini() {
  return (
    <div className="mkt-mini">
      {[
        ["Lakshmi", "Manager", "Menu, reviews, shifts"],
        ["Arun", "Staff", "Menu, checklists"],
      ].map(([name, role, access]) => (
        <div key={name} className="mkt-mini-row justify-between">
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full text-[0.625rem] font-bold text-white" style={{ background: "var(--m-plum)" }}>{name[0]}</span>
            <span className="font-semibold">{name}</span>
            <span className="mkt-tag mkt-tag-mute">{role}</span>
          </span>
          <span style={{ color: "var(--m-mute)" }}>{access}</span>
        </div>
      ))}
      <div className="mkt-mini-row justify-between">
        <span className="flex items-center gap-2">
          <PiCheckBold className="size-3.5" style={{ color: "var(--m-leaf)" }} aria-hidden />
          Opening checklist, 6 of 8 done
        </span>
        <span style={{ color: "var(--m-mute)" }}>Morning shift</span>
      </div>
    </div>
  );
}

function VisitsMini() {
  const bars = [38, 52, 44, 70, 64, 92, 86];
  return (
    <div className="mkt-mini p-3">
      <div className="flex items-end justify-between">
        <div>
          <p style={{ color: "var(--m-mute)" }}>Menu opens, this week</p>
          <p className="text-xl font-semibold tabular-nums" style={{ color: "var(--m-ink)" }}>1,284</p>
        </div>
        <svg viewBox="0 0 70 32" className="h-10 w-24" aria-hidden>
          {bars.map((h, i) => (
            <rect key={i} x={i * 10} y={32 - (h / 100) * 32} width={7} height={(h / 100) * 32} rx={1.5} fill={i === 5 ? "var(--m-saffron)" : "var(--m-brand)"} opacity={i === 5 ? 1 : 0.7} />
          ))}
        </svg>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg px-2.5 py-2" style={{ background: "var(--m-paper)", border: "1px solid var(--m-line)" }}>
        <PiMagnifyingGlassBold aria-hidden style={{ color: "var(--m-mute)" }} />
        <span>&ldquo;gulab jamun&rdquo; searched 14 times, no dish found</span>
      </div>
    </div>
  );
}

export function DashboardBento() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      <Tile a={area("menu")} className="lg:col-span-4">
        <MenuScanMini />
      </Tile>
      <Tile a={area("website")} className="lg:col-span-2">
        <WebsiteMini />
      </Tile>
      <Tile a={area("reviews")} className="lg:col-span-2">
        <ReviewsMini />
      </Tile>
      <Tile a={area("social")} className="lg:col-span-2">
        <SocialMini />
      </Tile>
      <Tile a={area("qr")} className="lg:col-span-2">
        <QrMini />
      </Tile>
      <Tile a={area("team")} className="lg:col-span-3">
        <TeamMini />
      </Tile>
      <Tile a={area("visits")} className="lg:col-span-3">
        <VisitsMini />
      </Tile>
    </div>
  );
}
