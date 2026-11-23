"use client";

import React, { useMemo, useState } from "react";
import { PiCheckBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { QR_FRAME_FAMILY_LABELS } from "@/constants/qrCodes.constants";
import type { QrDesign, QrFrameFamily, QrFrameFilter, QrFrameFormat, QrFrameMeta, QrFramePalette, QrLayout } from "@/types";
import { cn } from "@/utils/cn";
import { framesFor, qrStyleOf, recommendedFrames, tableLabel, withPalette } from "../../lib/design";
import { QrArtwork } from "../QrArtwork";
import { Chip, ColorField, PanelSection } from "./PanelParts";

interface QrFramePanelProps {
  design: QrDesign;
  businessName: string;
  businessType?: string;
  brand: QrFramePalette | null;
  onSelectFrame: (frame: QrFrameMeta) => void;
  onPalette: (palette: Pick<QrFramePalette, "paper" | "ink" | "accent">) => void;
  onLayout: (layout: QrLayout) => void;
}

function PaletteSwatch({ palette, selected, onClick }: { palette: QrFramePalette; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={palette.name}
      aria-label={`${palette.name} colours`}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-lg border p-1.5 pr-3 text-caption transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40",
      )}
    >
      <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-md border border-border" style={{ backgroundColor: palette.paper }}>
        <span className="absolute left-1 top-1 size-3 rounded-full" style={{ backgroundColor: palette.accent }} />
        <span className="absolute bottom-1 right-1 size-3 rounded-sm" style={{ backgroundColor: palette.ink }} />
      </span>
      <span className="text-foreground">{palette.name}</span>
      {selected ? <PiCheckBold aria-hidden className="size-3.5 text-primary" /> : null}
    </button>
  );
}

/** Frame gallery for the current layout, then the frame's colours. */
export function QrFramePanel({ design, businessName, businessType, brand, onSelectFrame, onPalette, onLayout }: QrFramePanelProps) {
  const layout = design.frame.layout;
  const format: QrFrameFormat = layout === "sticker" ? "sticker" : "card";
  const all = useMemo(() => framesFor(format), [format]);
  const forYou = useMemo(
    () => (businessType ? all.filter((f) => f.businessTypes.includes(businessType)) : []),
    [all, businessType],
  );
  const families = useMemo(() => {
    const set = new Set<QrFrameFamily>();
    all.forEach((f) => (f.families === "all" ? null : f.families.forEach((fam) => set.add(fam))));
    return Array.from(set);
  }, [all]);
  const [chosenFilter, setFilter] = useState<QrFrameFilter>(forYou.length ? "for-you" : "all");
  // A filter can stop applying when the layout switches between cards and stickers.
  const filter: QrFrameFilter =
    (chosenFilter === "for-you" && !forYou.length) ||
    (chosenFilter !== "for-you" && chosenFilter !== "all" && chosenFilter !== "universal" && !families.includes(chosenFilter))
      ? "all"
      : chosenFilter;

  if (layout === "none") {
    return (
      <div className="space-y-4 rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-body text-foreground">Frames are for table cards and stickers.</p>
        <p className="text-caption text-muted-foreground">They add your name, a few words and a design around the code.</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="sm" onClick={() => onLayout("card")}>Make a table card</Button>
          <Button size="sm" variant="secondary" onClick={() => onLayout("sticker")}>Make a sticker</Button>
        </div>
      </div>
    );
  }

  const shown =
    filter === "for-you"
      ? recommendedFrames(format, businessType)
      : filter === "all"
        ? all
        : filter === "universal"
          ? all.filter((f) => f.families === "all")
          : all.filter((f) => f.families !== "all" && f.families.includes(filter));
  const selectedId = format === "card" ? design.frame.cardId : design.frame.stickerId;
  const selected = all.find((f) => f.id === selectedId) ?? all[0];
  const palettes = brand ? [...selected.palettes, brand] : selected.palettes;
  const isCurrent = (p: QrFramePalette) => p.paper === design.frame.paper && p.ink === design.frame.ink && p.accent === design.frame.accent;
  const sampleName = design.frame.showName ? businessName : "";

  return (
    <div className="space-y-6">
      <PanelSection title={format === "card" ? "Card design" : "Sticker design"}>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter frames">
          {forYou.length ? (
            <Chip selected={filter === "for-you"} onClick={() => setFilter("for-you")}>For you</Chip>
          ) : null}
          <Chip selected={filter === "all"} onClick={() => setFilter("all")}>All ({all.length})</Chip>
          <Chip selected={filter === "universal"} onClick={() => setFilter("universal")}>Any business</Chip>
          {families.map((fam) => (
            <Chip key={fam} selected={filter === fam} onClick={() => setFilter(fam)}>
              {QR_FRAME_FAMILY_LABELS[fam]}
            </Chip>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shown.map((frame) => {
            const isSelected = frame.id === selected.id;
            const look = isSelected ? design : withPalette(design, frame.palettes[0]);
            return (
              <button
                key={frame.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={frame.name}
                onClick={() => (isSelected ? undefined : onSelectFrame(frame))}
                className={cn(
                  "group flex flex-col gap-2 rounded-lg border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isSelected ? "border-primary bg-accent/60 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-muted/40",
                )}
              >
                <span className="flex items-center justify-center rounded-md bg-muted/60 p-2">
                  <QrArtwork
                    thumbnail
                    layout={format}
                    frameId={frame.id}
                    colors={look.frame}
                    headline={design.frame.headline}
                    subline={design.frame.subline}
                    name={sampleName}
                    table={tableLabel(design.frame)}
                    qr={qrStyleOf(look, "")}
                    margin={0}
                    label=""
                    className={cn("h-auto w-full drop-shadow-sm", format === "card" ? "max-w-[7.5rem]" : "max-w-[6.5rem]")}
                  />
                </span>
                <span className="flex items-center justify-between gap-1 px-0.5">
                  <span className="truncate text-caption font-medium text-foreground">{frame.name}</span>
                  {isSelected ? <PiCheckBold aria-hidden className="size-3.5 shrink-0 text-primary" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </PanelSection>

      <PanelSection title="Colours" hint="The code always stays dark on light so it scans.">
        <div className="flex flex-wrap gap-2">
          {palettes.map((p) => (
            <PaletteSwatch key={p.id} palette={p} selected={isCurrent(p)} onClick={() => onPalette(p)} />
          ))}
        </div>
        <details className="group">
          <summary className="cursor-pointer text-body text-muted-foreground marker:text-muted-foreground hover:text-foreground">
            Pick your own colours
          </summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <ColorField label="Background" value={design.frame.paper} onChange={(paper) => onPalette({ ...design.frame, paper })} />
            <ColorField label="Text" value={design.frame.ink} onChange={(ink) => onPalette({ ...design.frame, ink })} />
            <ColorField label="Decoration" value={design.frame.accent} onChange={(accent) => onPalette({ ...design.frame, accent })} />
          </div>
        </details>
      </PanelSection>
    </div>
  );
}
