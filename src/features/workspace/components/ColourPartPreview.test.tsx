import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { contrastRatio, readability } from "@/utils/contrast";
import { ColourPartPreview, readabilityChecks } from "./ColourPartPreview";

describe("contrast helpers", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 1); // the classic AA grey
    expect(contrastRatio("tomato", "#fff")).toBeNull();
  });

  it("buckets ratios into plain-language verdicts", () => {
    expect(readability(7)).toBe("good");
    expect(readability(3.5)).toBe("large-only");
    expect(readability(1.5)).toBe("poor");
  });
});

describe("ColourPartPreview", () => {
  const good = {
    accent_color: "#ffffff",
    section_bg_color: "#f4f4f4",
    footer_bg_color: "#eeeeee",
    secondary_color: "#ffffff",
    text_primary_color: "#111111",
    text_secondary_color: "#555555",
    primary_color: "#8c3b2a",
    accent_text_color: "#ffffff",
  };

  it("says all text is easy to read for a well-chosen page palette", () => {
    render(<ColourPartPreview part="page" values={good} />);
    expect(screen.getByText("All text is easy to read")).toBeInTheDocument();
    expect(screen.getAllByText("Easy to read")).toHaveLength(readabilityChecks("page", good).length);
  });

  it("warns, with a tip, when the owner picks text that disappears into the background", () => {
    render(<ColourPartPreview part="page" values={{ ...good, footer_bg_color: "#151515" }} />);
    expect(screen.getByText("Some text is hard to read")).toBeInTheDocument();
    expect(screen.getByText("Text in the footer").closest("li")).toHaveTextContent("Hard to read");
    expect(screen.getByText(/Tip:/)).toBeInTheDocument();
  });

  it("checks button labels for the highlight colour", () => {
    render(<ColourPartPreview part="accent" values={{ ...good, primary_color: "#fde68a", accent_text_color: "#ffffff" }} />);
    expect(screen.getByText("Button labels").closest("li")).toHaveTextContent("Hard to read");
  });

  it("uses the menu's own colours on the menu page (header bar, dish cards, Pay bill)", () => {
    const menu = {
      menu_secondary_color: "#ffffff",
      menu_accent_color: "#fff7ef",
      menu_footer_bg_color: "#fff7ef",
      menu_section_bg_color: "#ffffff",
      menu_text_primary_color: "#1f1a17",
      menu_text_secondary_color: "#5c534c",
      menu_primary_color: "#fde68a", // pale highlight: prices + Pay bill label become hard to read
      menu_accent_text_color: "#ffffff",
    };
    render(<ColourPartPreview part="accent" values={menu} page="menu" />);
    expect(screen.getByText("Pay bill")).toBeInTheDocument();
    expect(screen.getByText("Pay bill button label").closest("li")).toHaveTextContent("Hard to read");
    expect(readabilityChecks("header", menu, "menu").map((c) => c.label)).toContain("Text on the header bar");
  });
});
