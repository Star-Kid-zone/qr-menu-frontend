"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PiArrowSquareOutBold,
  PiDeviceMobileBold,
  PiForkKnifeBold,
  PiHouseBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";

type PreviewView = "landing" | "menu";

interface DevicePreset {
  id: string;
  label: string;
  name: string;
  /** Real CSS-pixel viewport size of the device — content renders at this size, 1:1. */
  width: number;
  height: number;
}

// Real device viewports, small to large — content always renders at the
// device's true width (never squeezed), so layouts behave exactly as they
// would on that actual phone. The whole mockup (bezel + content) is then
// visually scaled down as one unit to fit the sidebar, so switching devices
// shows a genuinely smaller/bigger phone, not just a resized viewport.
const DEVICES: DevicePreset[] = [
  { id: "sm", label: "S", name: "iPhone SE", width: 375, height: 667 },
  { id: "md", label: "M", name: "iPhone 14", width: 390, height: 844 },
  { id: "lg", label: "L", name: "iPhone 14 Pro Max", width: 430, height: 932 },
];

const BEZEL_BORDER = 10;
const CONTAINER_WIDTH = 260; // available width budget inside the sidebar column
const largestDevice = DEVICES[DEVICES.length - 1];
const GLOBAL_SCALE = CONTAINER_WIDTH / (largestDevice.width + BEZEL_BORDER * 2);

/**
 * Renders `children` inside a real `<iframe>` document instead of directly in
 * the admin page's DOM. This matters because Tailwind's `sm:`/`md:`/`lg:`
 * utilities are ordinary viewport media queries — they evaluate against the
 * *browser window's* width, not the width of some div we've sized down to
 * "look like a phone". Rendered inline, every responsive class in the actual
 * templates stays permanently stuck in its desktop breakpoint (since the
 * admin's own window is always wide), no matter what device size is picked
 * here — which is exactly why bigger simulated widths revealed more
 * desktop-locked layout than the smaller one. An iframe is a genuine nested
 * browsing context with its own viewport, so resizing it actually flips the
 * template's responsive classes the same way a real phone would.
 */
function LandingFrame({
  width,
  height,
  children,
  onPick,
}: {
  width: number;
  height: number;
  children: ReactNode;
  /** When set, taps inside the page are captured (links and buttons don't fire) and reported instead. */
  onPick?: (target: Element) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameDoc, setFrameDoc] = useState<Document | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const syncHead = (doc: Document) => {
      doc.documentElement.className = document.documentElement.className;
      doc.head.querySelectorAll("link[rel='stylesheet'], style").forEach((n) => n.remove());
      document.head.querySelectorAll("link[rel='stylesheet'], style").forEach((node) => {
        doc.head.appendChild(node.cloneNode(true));
      });
      const resetStyle = doc.createElement("style");
      resetStyle.textContent = `
        html, body { margin: 0; overflow-x: hidden; }
        html { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar { display: none; }
      `;
      doc.head.appendChild(resetStyle);
    };

    const handleLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      syncHead(doc);
      setFrameDoc(doc);
    };

    iframe.addEventListener("load", handleLoad);
    if (iframe.contentDocument?.readyState === "complete") handleLoad();
    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  const onPickRef = useRef(onPick);
  useEffect(() => {
    onPickRef.current = onPick;
  });
  const picking = Boolean(onPick);

  useEffect(() => {
    if (!frameDoc || !picking) return;
    const style = frameDoc.createElement("style");
    style.textContent = "*{cursor:crosshair !important}";
    frameDoc.head.appendChild(style);
    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target instanceof frameDoc.defaultView!.Element) onPickRef.current?.(e.target);
    };
    frameDoc.addEventListener("click", handleClick, true);
    return () => {
      frameDoc.removeEventListener("click", handleClick, true);
      style.remove();
    };
  }, [frameDoc, picking]);

  return (
    <>
      <iframe
        ref={iframeRef}
        srcDoc="<!DOCTYPE html><html><head></head><body></body></html>"
        title="Landing page preview"
        className="border-0 bg-background"
        style={{ width, height }}
      />
      {frameDoc && createPortal(children, frameDoc.body)}
    </>
  );
}

interface PhonePreviewProps {
  /** Public landing page URL, or "" if the workspace has no slug yet — used only for the "open in new tab" link. */
  landingUrl: string;
  /** Public guest menu URL, or "" if the workspace has no slug yet — used only for the "open in new tab" link. */
  menuUrl: string;
  /** Which page to show first when the preview is opened. */
  defaultView?: PreviewView;
  /** Renders the landing page live from in-memory (possibly unsaved) draft data — no reload needed, it just re-renders. */
  renderLanding: () => ReactNode;
  /** Renders the menu page live from in-memory (possibly unsaved) draft data — no reload needed, it just re-renders. */
  renderMenu: () => ReactNode;
  /** Makes the landing preview tappable: reports the tapped element so the editor can open the matching settings. */
  onLandingPick?: (target: Element) => void;
  /** Makes the menu preview tappable: reports the tapped element so the editor can open the matching settings. */
  onMenuPick?: (target: Element) => void;
}

/**
 * Docked live-preview panel — sits in its own column beside the settings
 * panel (not floating over the page). Both the landing and menu pages render
 * directly from current draft state (updates instantly as fields change, no
 * save + reload round trip needed). A device switcher (small/medium/large)
 * lets the admin check how the page behaves at different real phone sizes.
 */
export function PhonePreview({
  landingUrl,
  menuUrl,
  defaultView = "landing",
  renderLanding,
  renderMenu,
  onLandingPick,
  onMenuPick,
}: PhonePreviewProps) {
  const [view, setView] = useState<PreviewView>(defaultView);
  const [device, setDevice] = useState<DevicePreset>(DEVICES[1]);

  // Sync the active view whenever the parent changes the defaultView prop
  // (e.g. switching between the Landing / Menu sub-tabs in workspace settings).
  // The user can still manually toggle within the preview at any time.
  const [syncedDefaultView, setSyncedDefaultView] = useState(defaultView);
  if (syncedDefaultView !== defaultView) {
    setSyncedDefaultView(defaultView);
    setView(defaultView);
  }

  const hasSlug = Boolean(landingUrl && menuUrl);
  const activeUrl = view === "landing" ? landingUrl : menuUrl;

  const bezelWidth = device.width + BEZEL_BORDER * 2;
  const bezelHeight = device.height + BEZEL_BORDER * 2;
  const visualWidth = Math.round(bezelWidth * GLOBAL_SCALE);
  const visualHeight = Math.round(bezelHeight * GLOBAL_SCALE);

  return (
    <div className="flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          <PiDeviceMobileBold className="size-4" /> Live Preview
        </p>
        <div className="flex items-center gap-0.5">
          {hasSlug && (
            <a
              href={activeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open in new tab"
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
            >
              <PiArrowSquareOutBold className="size-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => setView("landing")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
            view === "landing"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <PiHouseBold className="size-3.5" /> Landing
        </button>
        <button
          type="button"
          onClick={() => setView("menu")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            view === "menu"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <PiForkKnifeBold className="size-3.5" /> Menu
        </button>
      </div>

      {/* Device size switcher */}
      <div className="flex shrink-0 items-center justify-center gap-1.5">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDevice(d)}
            title={`${d.name} — ${d.width}×${d.height}`}
            className={cn(
              "flex size-6 items-center justify-center rounded-md border text-[10px] font-bold transition-colors",
              device.id === d.id
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {d.label}
          </button>
        ))}
        <span className="ml-1 text-[10px] font-medium text-muted-foreground">{device.name}</span>
      </div>

      {/* Phone mockup — sticky so it stays in view while the settings column scrolls. */}
      <div className="sticky top-0 flex min-h-0 flex-1 items-start justify-center overflow-hidden py-1">
        <div style={{ width: visualWidth, height: visualHeight }} className="relative shrink-0">
          <div
            className="absolute left-0 top-0 rounded-[2.5rem] border-neutral-900 bg-neutral-900 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)] dark:border-neutral-800 dark:bg-neutral-800"
            style={{
              width: bezelWidth,
              height: bezelHeight,
              borderWidth: BEZEL_BORDER,
              borderStyle: "solid",
              transform: `scale(${GLOBAL_SCALE})`,
              transformOrigin: "top left",
            }}
          >
            <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-neutral-900 dark:bg-neutral-800" />
            <div
              className="relative overflow-hidden rounded-[1.75rem] bg-background"
              style={{ width: device.width, height: device.height }}
            >
              {view === "landing" ? (
                <LandingFrame width={device.width} height={device.height} onPick={onLandingPick}>
                  {renderLanding()}
                </LandingFrame>
              ) : (
                <LandingFrame width={device.width} height={device.height} onPick={onMenuPick}>
                  {renderMenu()}
                </LandingFrame>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
