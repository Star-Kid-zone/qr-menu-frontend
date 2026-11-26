import {
  PiMagnifyingGlassBold,
  PiStarFill,
  PiWalletBold,
  PiStarBold,
  PiPhoneBold,
  PiMapPinBold,
  PiClockBold,
  PiCheckCircleFill,
} from "react-icons/pi";
import { cn } from "@/utils/cn";
import { QrPattern } from "./QrMark";
import "../marketing.css";
import { ROOT_DOMAIN } from "../content";

/*
 * The three screens a guest sees after scanning. Every element is a real
 * feature of the guest menu and tenant website: search, categories,
 * veg/non-veg marks, spice, calories, sold-out, offers, hours, Google
 * reviews, Pay bill and Review buttons. Decorative, so text is not editable.
 */

const RESTAURANT = "Annapoorna Kitchen";

const DISHES = [
  { name: "Paneer tikka", note: "Charred cottage cheese, mint chutney", price: "₹240", veg: true, spice: "Medium", kcal: "310 kcal" },
  { name: "Chicken 65", note: "Curry leaves, red chilli", price: "₹280", veg: false, spice: "Hot", tag: "Popular" },
  { name: "Ghee roast dosa", note: "Crisp, with sambar and chutneys", price: "₹160", veg: true, kcal: "420 kcal" },
  { name: "Butter naan", note: "From the tandoor", price: "₹60", veg: true },
];

function FoodMark({ veg }: { veg: boolean }) {
  return <span className={cn("mkt-foodmark mt-0.5", veg ? "mkt-veg" : "mkt-nonveg")} role="img" aria-label={veg ? "Veg" : "Non-veg"} />;
}

export function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mkt-phone", className)}>
      <div className="mkt-phone-screen">
        <div className="mkt-phone-notch" aria-hidden />
        {children}
      </div>
    </div>
  );
}

export function MenuScreen() {
  return (
    <div className="flex h-full flex-col text-[0.8125rem]">
      <div className="border-b px-4 pb-3 pt-9" style={{ borderColor: "var(--m-line)" }}>
        <p className="text-[0.9375rem] font-semibold">{RESTAURANT}</p>
        <p className="text-xs" style={{ color: "var(--m-mute)" }}>Open until 11 pm</p>
        <div className="mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--m-line)", color: "var(--m-mute)" }}>
          <PiMagnifyingGlassBold className="size-3.5" aria-hidden />
          Search dishes
        </div>
        <div className="mt-3 flex gap-1.5 text-xs">
          {["Starters", "Mains", "Dosas", "Breads"].map((c, i) => (
            <span
              key={c}
              className="rounded-full px-2.5 py-1"
              style={i === 0 ? { background: "var(--m-brand)", color: "#fff" } : { color: "var(--m-mute)" }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <ul className="flex-1">
        {DISHES.map((d, i) => (
          <li key={d.name} className="flex gap-2.5 px-4 py-2.5" style={{ borderTop: i ? "1px solid var(--m-line)" : undefined }}>
            <FoodMark veg={d.veg} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate font-semibold">{d.name}</p>
                <p className="tabular-nums">{d.price}</p>
              </div>
              <p className="truncate text-xs" style={{ color: "var(--m-mute)" }}>{d.note}</p>
              {(d.spice || d.tag || d.kcal) && (
                <p className="mt-1 flex items-center gap-1.5 text-[0.6875rem]">
                  {d.spice && <span style={{ color: "var(--m-chilli)" }}>{d.spice} spicy</span>}
                  {d.kcal && <span style={{ color: "var(--m-mute)" }}>{d.kcal}</span>}
                  {d.tag && <span className="mkt-tag mkt-tag-saffron">{d.tag}</span>}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-2 border-t p-3" style={{ borderColor: "var(--m-line)" }}>
        <span className="flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold text-white" style={{ background: "var(--m-brand)" }}>
          <PiWalletBold className="size-3.5" aria-hidden />
          Pay bill
        </span>
        <span className="flex items-center justify-center gap-1.5 rounded-full border py-2 text-xs font-semibold" style={{ borderColor: "var(--m-line)" }}>
          <PiStarBold className="size-3.5" aria-hidden />
          Review
        </span>
      </div>
    </div>
  );
}

export function WebsiteScreen() {
  return (
    <div className="flex h-full flex-col text-[0.8125rem]">
      <div className="mkt-plum-light relative px-4 pb-5 pt-10" style={{ color: "var(--m-on-plum)" }}>
        <p className="text-[0.625rem]" style={{ color: "var(--m-on-plum-mute)" }}>annapoorna.{ROOT_DOMAIN}</p>
        <p className="mkt-h3 mt-2 text-white">{RESTAURANT}</p>
        <p className="mt-1 text-xs" style={{ color: "var(--m-on-plum-mute)" }}>Home-style Chettinad cooking since 1998</p>
        <div className="mt-3 flex gap-1.5 text-[0.6875rem] font-semibold">
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: "var(--m-saffron)", color: "var(--m-plum-deep)" }}>
            <PiPhoneBold aria-hidden /> Call
          </span>
          <span className="flex items-center gap-1 rounded-full border px-2.5 py-1" style={{ borderColor: "rgb(255 255 255 / 0.3)" }}>
            <PiMapPinBold aria-hidden /> Directions
          </span>
        </div>
      </div>
      <div className="flex-1 space-y-3 px-4 py-3">
        <div className="rounded-xl p-3" style={{ background: "#fdf0d2", color: "#7a5100" }}>
          <p className="text-[0.6875rem] font-semibold">This week&apos;s offer</p>
          <p className="mt-0.5 text-xs font-semibold">Family thali for four, ₹899</p>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <PiClockBold className="mt-0.5 size-3.5 shrink-0" style={{ color: "var(--m-brand)" }} aria-hidden />
          <div>
            <p className="font-semibold">Open today 11 am to 11 pm</p>
            <p style={{ color: "var(--m-mute)" }}>12 Kamaraj Salai, Madurai</p>
          </div>
        </div>
        <div className="rounded-xl border p-3" style={{ borderColor: "var(--m-line)" }}>
          <div className="flex items-center gap-1" style={{ color: "var(--m-saffron-deep)" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <PiStarFill key={i} className="size-3" aria-hidden />
            ))}
            <span className="ml-1 text-[0.6875rem] font-semibold" style={{ color: "var(--m-ink)" }}>Google review</span>
          </div>
          <p className="mt-1.5 text-xs" style={{ color: "var(--m-mute)" }}>
            &ldquo;The mutton chukka tastes like my grandmother&apos;s. Scanned the menu, paid in a minute.&rdquo;
          </p>
          <p className="mt-1 text-[0.6875rem] font-semibold">Priya R.</p>
        </div>
      </div>
    </div>
  );
}

export function PayScreen() {
  return (
    <div className="relative flex h-full flex-col text-[0.8125rem]">
      <div className="px-4 pt-10 opacity-40">
        <p className="text-[0.9375rem] font-semibold">{RESTAURANT}</p>
        <div className="mt-3 space-y-2">
          {DISHES.slice(0, 3).map((d) => (
            <div key={d.name} className="flex justify-between text-xs">
              <span>{d.name}</span>
              <span className="tabular-nums">{d.price}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t px-4 pb-4 pt-3 shadow-[0_-20px_40px_-20px_rgb(20_8_30/0.35)]" style={{ background: "var(--m-paper)", borderColor: "var(--m-line)" }}>
        <div className="mx-auto mb-3 h-1 w-9 rounded-full" style={{ background: "var(--m-line)" }} aria-hidden />
        <p className="font-semibold">Pay your bill</p>
        <p className="text-xs" style={{ color: "var(--m-mute)" }}>Scan with any UPI app</p>
        <div className="mx-auto my-3 w-28 rounded-xl border p-2" style={{ borderColor: "var(--m-line)" }}>
          <QrPattern className="w-full" ink="var(--m-ink)" accent="var(--m-brand)" />
        </div>
        <p className="text-center text-[0.6875rem]" style={{ color: "var(--m-mute)" }}>annapoorna@upi</p>
        <div className="mt-3 flex items-center gap-2 rounded-xl p-2.5" style={{ background: "#e3f3ea", color: "#1f6b45" }}>
          <PiCheckCircleFill className="size-4 shrink-0" aria-hidden />
          <p className="text-xs font-semibold">Paid? Leave us a Google review</p>
        </div>
      </div>
    </div>
  );
}
