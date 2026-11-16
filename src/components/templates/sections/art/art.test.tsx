import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LandingSectionContext, SectionInstance } from "../types";

// The real player needs canvas + WASM; the intro's behaviour doesn't depend on it.
vi.mock("./ThemedLottie", async (orig) => {
  const actual = await orig<typeof import("./ThemedLottie")>();
  return { ...actual, ThemedLottie: () => <div data-testid="lottie" /> };
});

import { STEAM_ANIMATION } from "./lottie/steam";
import { toSlotColor } from "./ThemedLottie";
import { INTRO_DURATION_MS, IntroSection, resetIntroDecisions } from "../landing/intro";

type Json = Record<string, unknown>;
const walk = (node: unknown, visit: (n: Json) => void) => {
  if (Array.isArray(node)) node.forEach((n) => walk(n, visit));
  else if (node && typeof node === "object") {
    visit(node as Json);
    Object.values(node as Json).forEach((v) => walk(v, visit));
  }
};

describe("steam Lottie", () => {
  const anim = STEAM_ANIMATION as unknown as Json;

  it("declares the accent slot and routes every stroke colour through it", () => {
    expect((anim.slots as Json).accent).toBeDefined();
    const strokes: Json[] = [];
    walk(anim.layers, (n) => n.ty === "st" && strokes.push(n));
    expect(strokes.length).toBeGreaterThanOrEqual(4);
    for (const st of strokes) expect((st.c as Json).sid).toBe("accent");
  });

  it("keeps every layer and keyframe inside the 60-frame timeline, with easing on all but the last key", () => {
    for (const layer of anim.layers as Json[]) {
      expect(layer.ip).toBe(0);
      expect(layer.op).toBe(anim.op);
    }
    walk(anim.layers, (n) => {
      if (n.a === 1 && Array.isArray(n.k)) {
        const keys = n.k as Json[];
        keys.forEach((k, i) => {
          expect(k.t as number).toBeGreaterThanOrEqual(0);
          expect(k.t as number).toBeLessThanOrEqual(anim.op as number);
          if (i < keys.length - 1) expect(k.i && k.o).toBeTruthy();
        });
      }
    });
  });

  it("ends every shape group with its transform (renderers require it)", () => {
    walk(anim.layers, (n) => {
      if (n.ty === "gr") expect(((n.it as Json[]).at(-1) as Json).ty).toBe("tr");
    });
  });
});

describe("toSlotColor", () => {
  it("converts hex to 0–1 RGBA and rejects non-hex", () => {
    expect(toSlotColor("#FF8000")).toEqual([1, 128 / 255, 0, 1]);
    expect(toSlotColor("tomato")).toBeNull();
  });
});

describe("opening screen", () => {
  const ctx = (isPreview = false) =>
    ({
      c: { businessName: "Vimal Kitchen", logoUrl: "" },
      t: { bg: "#fff", accent: "#b22222", textPrimary: "#111", textSecondary: "#555", border: "#ddd", fontFamily: "serif" },
      p: { routeSlug: "vimal", isPreview },
    }) as unknown as LandingSectionContext;
  const section: SectionInstance = { id: "intro", type: "intro" };

  beforeEach(() => {
    window.sessionStorage.clear();
    resetIntroDecisions();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("is never part of the server-rendered page", () => {
    expect(renderToStaticMarkup(<IntroSection ctx={ctx()} section={section} />)).toBe("");
  });

  it("shows once per visit, then hides itself after the set time", () => {
    render(<IntroSection ctx={ctx()} section={section} />);
    expect(screen.getByTestId("lottie")).toBeInTheDocument(); // the real animation for guests
    expect(screen.getByRole("dialog", { name: "Welcome to Vimal Kitchen" })).toBeInTheDocument();
    expect(window.sessionStorage.getItem("qr-intro-seen:vimal")).toBe("1");
    act(() => vi.advanceTimersByTime(INTRO_DURATION_MS));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("can be skipped", () => {
    render(<IntroSection ctx={ctx()} section={section} />);
    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("doesn't show again on the next page load in the same visit", () => {
    window.sessionStorage.setItem("qr-intro-seen:vimal", "1");
    render(<IntroSection ctx={ctx()} section={section} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders inline (never as an overlay) in the admin preview", () => {
    const { container } = render(<IntroSection ctx={ctx(true)} section={section} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(container.querySelector("[data-intro-preview]")).not.toBeNull();
    // A slim labelled strip with a still icon (the player can't draw in the preview iframe),
    // not a full-size copy of the logo and name.
    expect(screen.queryByTestId("lottie")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.textContent).toMatch(/Opening screen/);
    expect(container.textContent).not.toContain("Vimal Kitchen");
  });

  it("the 'Logo and name' design has no animation", () => {
    const { container } = render(<IntroSection ctx={ctx(true)} section={{ ...section, variant: "simple" }} />);
    expect(screen.queryByTestId("lottie")).toBeNull();
    expect(container.querySelector("svg")).toBeNull();
  });
});

describe("self-hosted Lottie engine", () => {
  it("ships the exact WASM of the installed player, at the URL the component uses", async () => {
    const { readFileSync, existsSync } = await import("node:fs");
    const { join, dirname } = await import("node:path");
    const { DOTLOTTIE_WASM_URL } = await vi.importActual<typeof import("./ThemedLottie")>("./ThemedLottie");
    const shipped = join(process.cwd(), "public", DOTLOTTIE_WASM_URL);
    expect(existsSync(shipped)).toBe(true);

    // Resolve the installed dotlottie-web through dotlottie-react (pnpm keeps it nested).
    const reactEntry = require.resolve("@lottiefiles/dotlottie-react");
    const webDir = join(dirname(require.resolve("@lottiefiles/dotlottie-web", { paths: [reactEntry] })));
    const installed = join(webDir, "dotlottie-player.wasm");
    const version = JSON.parse(readFileSync(join(webDir, "..", "package.json"), "utf8")).version as string;

    expect(DOTLOTTIE_WASM_URL).toContain(version);
    expect(readFileSync(shipped).equals(readFileSync(installed))).toBe(true);
  });
});
