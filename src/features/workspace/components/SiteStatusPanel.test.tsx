import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SiteDocument } from "@/components/templates/sections/types";
import { SiteStatusPanel } from "./SiteStatusPanel";
import { SectionsPanel } from "./SectionsPanel";

function setup(value: SiteDocument | null) {
  const onChange = vi.fn();
  render(<SiteStatusPanel formId="f" value={value} disabled={false} onChange={onChange} />);
  return onChange;
}

describe("SiteStatusPanel", () => {
  it("starts on Open with no extra fields", () => {
    setup(null);
    expect(screen.getByRole("radio", { name: /^Open/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.queryByLabelText("Reopens on (optional)")).toBeNull();
  });

  it("sets a closure and keeps the rest of the document", () => {
    const value: SiteDocument = { version: 1, landing: { sections: [{ id: "hero", type: "hero" }] } };
    const onChange = setup(value);
    fireEvent.click(screen.getByRole("radio", { name: /^Holiday/ }));
    expect(onChange).toHaveBeenCalledWith({ ...value, status: { mode: "holiday" } });
  });

  it("writes the message and reopen date", () => {
    const value: SiteDocument = { version: 1, status: { mode: "holiday" } };
    const onChange = setup(value);
    fireEvent.change(screen.getByLabelText("Reopens on (optional)"), { target: { value: "2026-12-20" } });
    expect(onChange).toHaveBeenLastCalledWith({ version: 1, status: { mode: "holiday", until: "2026-12-20" } });
    fireEvent.change(screen.getByLabelText("Message (optional)"), { target: { value: "Back after Eid" } });
    expect(onChange).toHaveBeenLastCalledWith({ version: 1, status: { mode: "holiday", message: "Back after Eid" } });
  });

  it("Open removes the status, and returns null when nothing else is customised", () => {
    const onChange = setup({ version: 1, status: { mode: "renovation" } });
    fireEvent.click(screen.getByRole("radio", { name: /^Open/ }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

describe("SectionsPanel with status and schedules", () => {
  it("Reset order keeps the site status", () => {
    const onChange = vi.fn();
    const value: SiteDocument = { version: 1, landing: { sections: [{ id: "hero", type: "hero" }] }, status: { mode: "holiday" } };
    render(<SectionsPanel value={value} structureKey="" disabled={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Reset order" }));
    expect(onChange).toHaveBeenCalledWith({ version: 1, status: { mode: "holiday" } });
  });

  it("schedules a section and clears it again", () => {
    const onChange = vi.fn();
    const { rerender } = render(<SectionsPanel value={null} structureKey="" disabled={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Schedule Offers" }));
    fireEvent.change(screen.getByLabelText("Offers: until"), { target: { value: "2026-12-31" } });
    const doc = onChange.mock.calls[0][0] as SiteDocument;
    expect(doc.landing?.sections.find((s) => s.type === "offers")?.schedule).toEqual({ to: "2026-12-31" });

    rerender(<SectionsPanel value={doc} structureKey="" disabled={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Always show" }));
    const cleared = onChange.mock.calls[1][0] as SiteDocument;
    expect(cleared.landing?.sections.find((s) => s.type === "offers")?.schedule).toBeUndefined();
  });
});
