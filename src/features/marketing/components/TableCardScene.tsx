import { PiMagnifyingGlassBold, PiStarBold, PiWalletBold } from "react-icons/pi";
import { cn } from "@/utils/cn";

/*
 * Illustration for the hero: a printed table card next to the phone screen a
 * guest sees after scanning it. Every element on the phone is a real feature of
 * the guest menu (search, categories, veg/non-veg marks, spice, Pay bill, Review).
 */

// A fixed 21×21 module pattern with the three finder squares, drawn as SVG.
// Decorative only: it does not encode a link.
const SIZE = 21;
const SEED = "1011010010110100101101001011011100101010110010110101001101010011010110011010101101010011011010100110101001101101010011010101011010100110101101001101011010100110101100101101001011010110100101101010110101001011";

function isFinder(x: number, y: number) {
  const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
  return inBox(0, 0) || inBox(SIZE - 7, 0) || inBox(0, SIZE - 7);
}

function QrPattern({ className }: { className?: string }) {
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (isFinder(x, y)) continue;
      if (SEED[(y * SIZE + x) % SEED.length] === "1") cells.push({ x, y });
    }
  }
  const finder = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox} y={oy} width={7} height={7} />
      <rect x={ox + 1} y={oy + 1} width={5} height={5} className="fill-card" />
      <rect x={ox + 2} y={oy + 2} width={3} height={3} />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`} className={cn("fill-foreground", className)} aria-hidden shapeRendering="crispEdges">
      {cells.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
      ))}
      {finder(0, 0)}
      {finder(SIZE - 7, 0)}
      {finder(0, SIZE - 7)}
    </svg>
  );
}

// The Indian food-type mark: a square outline with a filled dot (green veg, red non-veg).
function FoodMark({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn("inline-flex size-3.5 shrink-0 items-center justify-center border", veg ? "border-success" : "border-destructive")}
      aria-label={veg ? "Veg" : "Non-veg"}
      role="img"
    >
      <span className={cn("size-1.5 rounded-full", veg ? "bg-success" : "bg-destructive")} />
    </span>
  );
}

const DISHES = [
  { name: "Paneer tikka", note: "Charred cottage cheese, mint chutney", price: "₹240", veg: true, spice: "Medium spicy" },
  { name: "Chicken 65", note: "Curry leaves, red chilli", price: "₹280", veg: false, spice: "Hot", tag: "Popular" },
  { name: "Butter naan", note: "From the tandoor", price: "₹60", veg: true },
];

function PhoneMenu() {
  return (
    <div className="w-[17rem] rounded-[2.25rem] border border-border bg-foreground p-2 dark:bg-muted shadow-[0_24px_48px_-24px_rgb(0_0_0/0.35)]">
      <div className="overflow-hidden rounded-[1.75rem] bg-card text-foreground">
        <div className="border-b border-border px-4 pb-3 pt-6">
          <p className="text-base font-semibold">Annapoorna Kitchen</p>
          <p className="text-xs text-muted-foreground">Open until 11 pm</p>
          <div className="mt-3 flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground">
            <PiMagnifyingGlassBold className="size-3.5" aria-hidden />
            Search dishes
          </div>
          <div className="mt-3 flex gap-1 text-xs">
            {["Starters", "Mains", "Breads"].map((c, i) => (
              <span key={c} className={cn("rounded-md px-2 py-1", i === 0 ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
                {c}
              </span>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-border">
          {DISHES.map((d) => (
            <li key={d.name} className="flex gap-3 px-4 py-3">
              <FoodMark veg={d.veg} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{d.name}</p>
                  <p className="text-sm tabular-nums">{d.price}</p>
                </div>
                <p className="truncate text-xs text-muted-foreground">{d.note}</p>
                {(d.spice || d.tag) && (
                  <p className="mt-1 flex items-center gap-2 text-xs">
                    {d.spice && <span className="text-destructive">{d.spice}</span>}
                    {d.tag && <span className="rounded bg-muted px-1.5 py-0.5 text-foreground">{d.tag}</span>}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-2 border-t border-border p-3">
          <span className="flex items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground">
            <PiWalletBold className="size-3.5" aria-hidden />
            Pay bill
          </span>
          <span className="flex items-center justify-center gap-1.5 rounded-md border border-border py-2 text-xs font-semibold">
            <PiStarBold className="size-3.5" aria-hidden />
            Review
          </span>
        </div>
      </div>
    </div>
  );
}

function TableCard() {
  return (
    <div className="w-44 rounded-xl border border-border bg-card p-4 text-center shadow-[0_16px_32px_-20px_rgb(0_0_0/0.3)]">
      <p className="text-xs font-semibold text-foreground">Annapoorna Kitchen</p>
      <QrPattern className="mx-auto my-3 size-28" />
      <p className="text-sm font-semibold text-foreground">Scan for our menu</p>
    </div>
  );
}

export function TableCardScene() {
  return (
    <figure className="mx-auto flex w-full max-w-lg items-end justify-center gap-6 lg:justify-end" aria-label="A printed table card with a QR code, and the menu a guest sees on their phone after scanning it">
      <div className="mb-8 hidden sm:block">
        <TableCard />
      </div>
      <PhoneMenu />
    </figure>
  );
}
