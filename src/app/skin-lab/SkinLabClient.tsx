"use client";

import { useId, type CSSProperties } from "react";
import { FLAGSHIP_SKINS } from "@/components/site-system/skins/flagship";
import { SKINS, FAMILY_DEFAULTS } from "@/components/site-system/skins";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { GLYPH_GROUPS } from "@/components/site-system/icons/glyphs";
import { OrnamentCorner, frameStyle, textureBackground } from "@/components/site-system/ornaments";
import { ART_MOTIFS } from "@/components/templates/sections/art/motifs";
import type { IconStyle, SkinDefinition } from "@/components/site-system/types";

const STYLES: IconStyle[] = ["line", "fine-line", "filled", "duotone", "neon", "engraved", "hand-drawn", "pixel"];
const SAMPLE_ICONS = ["clock", "pin", "phone", "star", "wifi", "parking", "live-music", "outdoor-seating", "veg", "chili", "fish", "halal-certified"];

/** First family name of each stack, for one Google Fonts request. */
function fontFamilies(): string[] {
  const names = new Set<string>();
  for (const s of FLAGSHIP_SKINS) {
    for (const stack of [s.fonts.display, s.fonts.body]) {
      const m = stack.match(/"([^"]+)"/);
      if (m) names.add(m[1]);
    }
  }
  return [...names];
}

function Divider({ motif, color }: { motif: string; color: string }) {
  const uid = useId().replace(/:/g, "");
  const m = ART_MOTIFS.find((x) => x.value === motif);
  if (!m) return null;
  // Unique per divider: two skins can share a motif in different colours.
  const id = `lab-${motif}-${uid}`;
  return (
    <svg width="100%" height={m.h} aria-hidden style={{ color, display: "block" }}>
      <defs>
        <pattern id={id} width={m.w} height={m.h} patternUnits="userSpaceOnUse">{m.tile}</pattern>
      </defs>
      <rect width="100%" height={m.h} fill={`url(#${id})`} />
    </svg>
  );
}

function SkinCard({ skin }: { skin: SkinDefinition }) {
  const p = skin.palette;
  const vars = {
    "--site-accent": p.accent,
    "--site-surface": p.surface,
    "--site-radius": `${skin.shape.radius}px`,
  } as CSSProperties;
  return (
    <article
      data-skin={skin.id}
      style={{ ...vars, background: p.bg, color: p.text, fontFamily: skin.fonts.body, ...textureBackground(skin.background.texture, p) }}
      className="relative overflow-hidden rounded-lg border border-black/10"
    >
      <OrnamentCorner corner={skin.ornaments.corner} className="absolute left-2 top-2" />
      <OrnamentCorner corner={skin.ornaments.corner} className="absolute right-2 top-2 rotate-90" />
      <div className="grid gap-5 p-6 sm:grid-cols-[1fr_180px] sm:p-8">
        <div className="min-w-0">
          <p className="text-sm" style={{ color: p.textMuted }}>{FAMILY_DEFAULTS[skin.family].label} · {skin.iconStyle}</p>
          <h2 className={`mt-1 text-4xl leading-tight sm:text-5xl ${skin.headingClass}`} style={{ fontFamily: skin.fonts.display, color: p.text }}>
            {skin.label}
          </h2>
          <p className="mt-3 max-w-prose text-base leading-relaxed" style={{ color: p.textMuted }}>{skin.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold" style={{ background: p.accent, color: p.accentText, borderRadius: skin.shape.radius }}>
              <SiteIcon name="menu" size={18} iconStyle={skin.iconStyle} color={p.accentText} /> See the menu
            </span>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold" style={{ border: `1.5px solid ${p.accent}`, color: p.accent, borderRadius: skin.shape.radius }}>
              <SiteIcon name="directions" size={18} iconStyle={skin.iconStyle} color={p.accent} /> Directions
            </span>
          </div>
        </div>
        <div
          className="aspect-[4/5] w-full"
          style={{ ...frameStyle(skin.ornaments.frame, p), background: `linear-gradient(160deg, ${p.accent}, ${p.footer})` }}
          aria-label={`${skin.ornaments.frame} frame`}
        />
      </div>
      <div className="px-6 sm:px-8"><Divider motif={skin.ornaments.divider} color={p.accent} /></div>
      <div className="grid grid-cols-4 gap-3 p-6 sm:grid-cols-6 sm:p-8 lg:grid-cols-12" style={{ color: p.accent }}>
        {SAMPLE_ICONS.map((n) => (
          <div key={n} className="flex flex-col items-center gap-1.5 rounded-md p-2" style={{ background: p.surface }}>
            <SiteIcon name={n} size={28} iconStyle={skin.iconStyle} color={p.accent} />
            <span className="text-[11px]" style={{ color: p.textMuted }}>{n}</span>
          </div>
        ))}
      </div>
      <div className="flex h-8">
        {(["bg", "surface", "band", "accent", "text", "textMuted", "border", "footer"] as const).map((k) => (
          <div key={k} className="flex-1" style={{ background: p[k] }} title={`${k} ${p[k]}`} />
        ))}
      </div>
    </article>
  );
}

export function SkinLabClient({ family }: { family: string | null }) {
  const fonts = fontFamilies().map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;600;700`).join("&");
  const extra = family ? SKINS.filter((s) => s.family === family && s.id.startsWith("legacy-")) : [];
  return (
    <main className="min-h-dvh bg-neutral-100 px-4 py-10 text-neutral-900 sm:px-8">
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fonts}&display=swap`} precedence="default" />
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-2xl font-semibold">Skin lab</h1>
          <p className="text-sm text-neutral-600">12 flagship skins, then every icon in every style. Development only.</p>
        </header>
        <section className="space-y-6" aria-label="Flagship skins">
          {FLAGSHIP_SKINS.map((s) => <SkinCard key={s.id} skin={s} />)}
        </section>
        {extra.length > 0 && (
          <section className="space-y-6" aria-label={`Converted ${family} templates`}>
            {extra.map((s) => <SkinCard key={s.id} skin={s} />)}
          </section>
        )}
        <section aria-label="Icon sheet" className="overflow-x-auto rounded-lg bg-white p-4 sm:p-6">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white p-2 text-left">icon</th>
                {STYLES.map((s) => <th key={s} className="p-2 font-medium">{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {[...GLYPH_GROUPS.ui, ...GLYPH_GROUPS.amenities, ...GLYPH_GROUPS.dietary, ...GLYPH_GROUPS.food, ...GLYPH_GROUPS.drinks, ...GLYPH_GROUPS.shop].map((n) => (
                <tr key={n} className="border-t border-neutral-100">
                  <td className="sticky left-0 bg-white p-2 pr-4 text-neutral-600">{n}</td>
                  {STYLES.map((s) => (
                    <td key={s} className="p-2 text-center" style={{ color: s === "neon" ? "#ff4f95" : "#24121F", background: s === "neon" ? "#0e0b16" : undefined }}>
                      <SiteIcon name={n} size={28} iconStyle={s} color={s === "neon" ? "#ff4f95" : "#24121F"} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
