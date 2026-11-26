import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeastOwlLogo } from "./FeastOwlLogo";
import { BRAND_COLORS } from "@/constants/brand.constants";

describe("FeastOwlLogo", () => {
  it("reads as one word with the owl decorative", () => {
    const { container } = render(<FeastOwlLogo />);
    expect(screen.getByText(/Feast/).textContent).toBe("FeastOwl");
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("uses the saffron owl and saffron 'Owl' on dark backgrounds", () => {
    const { container } = render(<FeastOwlLogo tone="dark" />);
    expect(container.querySelector("svg path")?.getAttribute("fill")).toBe(BRAND_COLORS.saffron);
    expect(screen.getByText("Owl").style.color).not.toBe("");
  });

  it("renders both owls for auto tone, switched by the dark class", () => {
    const { container } = render(<FeastOwlLogo tone="auto" />);
    const marks = container.querySelectorAll("svg");
    expect(marks).toHaveLength(2);
    expect(marks[0].getAttribute("class")).toContain("dark:hidden");
    expect(marks[1].getAttribute("class")).toContain("dark:block");
  });
});
