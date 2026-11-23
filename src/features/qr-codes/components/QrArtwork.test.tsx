import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_QR_DESIGN, QR_FRAMES } from "@/constants/qrCodes.constants";
import { qrStyleOf } from "../lib/design";
import { QrArtwork } from "./QrArtwork";

const qr = qrStyleOf(DEFAULT_QR_DESIGN, "http://roma.localhost:3000/menu");

function draw(frameId: string, layout: "card" | "sticker" | "none", extra: Partial<{ thumbnail: boolean; table: string }> = {}) {
  return render(
    <QrArtwork
      layout={layout}
      frameId={frameId}
      colors={DEFAULT_QR_DESIGN.frame}
      headline="Scan for our menu"
      subline="Point your phone camera here"
      name="Pizza Roma"
      table={extra.table ?? "Table 7"}
      qr={qr}
      margin={4}
      thumbnail={extra.thumbnail}
    />,
  );
}

describe("QrArtwork", () => {
  it.each(QR_FRAMES.map((f) => [f.id, f.format] as const))("draws the %s frame with the live code inside", (id, format) => {
    const { container } = draw(id, format);
    const root = container.querySelector("svg")!;
    const [w, h] = format === "card" ? [600, 846] : [600, 600];
    expect(root.getAttribute("viewBox")).toBe(`0 0 ${w} ${h}`);
    // The QR library's own <svg>, nested in the frame.
    expect(root.querySelector('svg[aria-label="QR Code"]')).not.toBeNull();
    expect(root.textContent).toMatch(/SCAN FOR OUR MENU|Scan for our menu/);
  });

  it("shows the table number on cards", () => {
    const { container } = draw("classic", "card");
    expect(container.textContent).toContain("Table 7");
  });

  it("draws a stand-in code in thumbnails", () => {
    const { container } = draw("classic", "card", { thumbnail: true });
    expect(container.querySelector('svg[aria-label="QR Code"]')).toBeNull();
  });

  it("draws only the code for the bare layout", () => {
    const { container } = draw("", "none");
    expect(container.querySelector("svg")!.getAttribute("viewBox")).toBe("0 0 600 600");
    expect(container.textContent).not.toContain("Pizza Roma");
  });

  it("gives each drawing its own ids so copies on one page don't clash", () => {
    const { container } = render(
      <>
        <QrArtwork layout="card" frameId="trattoria" colors={DEFAULT_QR_DESIGN.frame} headline="" subline="" name="" table="" qr={qr} margin={0} />
        <QrArtwork layout="card" frameId="trattoria" colors={DEFAULT_QR_DESIGN.frame} headline="" subline="" name="" table="" qr={qr} margin={0} />
      </>,
    );
    const ids = Array.from(container.querySelectorAll("pattern")).map((p) => p.id);
    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
  });
});
