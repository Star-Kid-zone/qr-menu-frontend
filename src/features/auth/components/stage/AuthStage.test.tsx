import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/ui/Image", () => ({ default: () => null }));
// The still version: no endless float animation to cancel when a test unmounts.
vi.mock("framer-motion", async (importOriginal) => ({ ...(await importOriginal<typeof import("framer-motion")>()), useReducedMotion: () => true }));

import { AuthStage } from "./AuthStage";
import { AuthPreviewProvider, useAuthPreview } from "../../context/AuthPreviewContext";
import { useEffect } from "react";

function TypeName({ name }: { name: string }) {
  const { setBusinessName } = useAuthPreview();
  useEffect(() => setBusinessName(name), [name, setBusinessName]);
  return null;
}

describe("AuthStage", () => {
  it("keeps the 3D scene away from screen readers but leaves the copy readable", () => {
    const { container } = render(<AuthStage variant="signin" />);
    expect(screen.getByRole("heading", { name: "Pick up where you left off." })).toBeInTheDocument();
    expect(container.querySelector("div[aria-hidden='true']")?.textContent).toContain("Reply sent");
  });

  it("lists the three sign-up steps in order on register", () => {
    render(<AuthStage variant="register" />);
    const steps = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(steps[0]).toContain("Add your dishes");
    expect(steps[1]).toContain("Choose a look");
    expect(steps[2]).toContain("Print your QR codes");
  });

  it("shows the name being typed on the website card, with a preview address", () => {
    const { container } = render(
      <AuthPreviewProvider>
        <TypeName name="Spice Garden" />
        <AuthStage variant="register" />
      </AuthPreviewProvider>,
    );
    const scene = container.querySelector("div[aria-hidden='true']")!.textContent!;
    expect(scene).toContain("Spice Garden");
    expect(scene).toContain("spice-garden-xxxxxx.feastowl.com");
    // The website card switched to the typed name (the phone keeps its sample menu).
    expect(scene).not.toContain("annapoorna.feastowl.com");
  });

  it("shows the sample restaurant on sign-in", () => {
    const { container } = render(<AuthStage variant="signin" />);
    expect(container.querySelector("div[aria-hidden='true']")!.textContent).toContain("annapoorna.feastowl.com");
  });
});
