import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OwlMark } from "./OwlMark";
import { BRAND_COLORS } from "@/constants/brand.constants";

describe("OwlMark", () => {
  it("is decorative unless given a title", () => {
    const { container } = render(<OwlMark />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    render(<OwlMark title="FeastOwl" />);
    expect(screen.getByRole("img", { name: "FeastOwl" })).toBeInTheDocument();
  });

  it("draws the tile variant on a plum square", () => {
    const { container } = render(<OwlMark variant="tile" />);
    expect(container.querySelector("rect")?.getAttribute("fill")).toBe(BRAND_COLORS.plum);
  });

  it("draws the mono variant as one cut-out path in the current text colour", () => {
    const { container } = render(<OwlMark variant="mono" />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(1);
    expect(paths[0].getAttribute("fill")).toBe("currentColor");
    expect(paths[0].getAttribute("fill-rule")).toBe("evenodd");
  });
});
