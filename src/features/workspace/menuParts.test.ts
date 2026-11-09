import { describe, expect, it } from "vitest";
import { MENU_PARTS, isPartCustomised, resolveMenuPart } from "./menuParts";

const values = {
  menu_primary_color: "#ff0000",
  menu_secondary_color: "#eeeeee",
  menu_accent_color: "#fafafa",
  menu_section_bg_color: "#dddddd",
  menu_text_primary_color: "#111111",
  menu_text_secondary_color: "#444444",
  menu_accent_text_color: "#ffffff",
  menu_border_color: "#cccccc",
  menu_footer_bg_color: "#000000",
};

function mount(html: string) {
  document.body.innerHTML = html;
  return document.body;
}

describe("resolveMenuPart", () => {
  it("maps text colours to the text part", () => {
    const body = mount(`<div style="background:#fafafa"><h3 style="color:#111111">Pizza</h3></div>`);
    expect(resolveMenuPart(body.querySelector("h3")!, values)).toBe("text");
  });

  it("maps the highlight colour on text to prices & buttons", () => {
    const body = mount(`<div style="background:#dddddd"><span style="color:#ff0000">$9</span></div>`);
    expect(resolveMenuPart(body.querySelector("span")!, values)).toBe("accent");
  });

  it("maps card, bar and page backgrounds", () => {
    const body = mount(
      `<div style="background:#fafafa"><header style="background:#eeeeee"><i id="h"></i></header><div style="background:#dddddd"><i id="c"></i></div><i id="p"></i></div>`
    );
    expect(resolveMenuPart(body.querySelector("#h")!, values)).toBe("header");
    expect(resolveMenuPart(body.querySelector("#c")!, values)).toBe("card");
    expect(resolveMenuPart(body.querySelector("#p")!, values)).toBe("page");
  });

  it("lets an explicit data-part win", () => {
    const body = mount(`<div style="background:#fafafa"><button data-part="accent"><i id="x"></i></button></div>`);
    expect(resolveMenuPart(body.querySelector("#x")!, values)).toBe("accent");
  });

  it("falls back to page when nothing matches", () => {
    const body = mount(`<div><i id="x"></i></div>`);
    expect(resolveMenuPart(body.querySelector("#x")!, values)).toBe("page");
  });
});

describe("menu part helpers", () => {
  it("detects a part changed from its template", () => {
    const accent = MENU_PARTS.find((p) => p.id === "accent")!;
    const palette = { name: "T", alias: "t", primary: "#ff0000", secondary: "#fff", accent: "#fff", accentText: "#ffffff" };
    expect(isPartCustomised(accent, values, palette)).toBe(false);
    expect(isPartCustomised(accent, { ...values, menu_primary_color: "#00ff00" }, palette)).toBe(true);
    expect(isPartCustomised(accent, values, null)).toBe(false);
  });
});
