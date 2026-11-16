import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const svc = vi.hoisted(() => ({ getWorkspace: vi.fn(), chooseHeroImage: vi.fn(), uploadHeroImage: vi.fn() }));
vi.mock("@/services/workspace.service", () => ({ workspaceService: svc }));
vi.mock("@/components/ui", async (orig) => {
  const actual = await orig<typeof import("@/components/ui")>();
  return { ...actual, toast: { success: vi.fn(), error: vi.fn() } };
});

import { HeroImagePanel } from "./HeroImagePanel";

describe("HeroImagePanel", () => {
  beforeEach(() => {
    Object.values(svc).forEach((f) => f.mockReset());
    svc.getWorkspace.mockResolvedValue({ data: { theme: { bannerUrl: null }, gallery: [{ imageUrl: "/uploads/g1.jpg" }, { imageUrl: "/uploads/g2.jpg" }] } });
    svc.chooseHeroImage.mockImplementation(async (url: string | null) => ({ data: { url } }));
  });

  it("offers the owner's gallery photos and ready-made photos, and marks the current one", async () => {
    render(<HeroImagePanel disabled={false} />);
    const gallery = await screen.findByRole("radiogroup", { name: "Your gallery photos" });
    expect(within(gallery).getAllByRole("radio")).toHaveLength(2);
    expect(screen.getByRole("radiogroup", { name: "Ready-made photos" })).toBeInTheDocument();
    expect(screen.getByText("Using your style's own photo")).toBeInTheDocument();
  });

  it("picks a gallery photo, saves it and tells the page to reload", async () => {
    const onChanged = vi.fn();
    render(<HeroImagePanel disabled={false} onChanged={onChanged} />);
    fireEvent.click(await screen.findByRole("radio", { name: "Gallery photo 2" }));
    await waitFor(() => expect(onChanged).toHaveBeenCalled());
    expect(svc.chooseHeroImage).toHaveBeenCalledWith("/uploads/g2.jpg");
    expect(screen.getByRole("radio", { name: "Gallery photo 2" })).toHaveAttribute("aria-checked", "true");
  });

  it("uploads a photo and rejects the wrong file type or a huge file", async () => {
    svc.uploadHeroImage.mockResolvedValue({ data: { url: "/uploads/banner/new.jpg" } });
    const { container } = render(<HeroImagePanel disabled={false} />);
    await screen.findByRole("radiogroup", { name: "Ready-made photos" });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [new File(["x"], "doc.pdf", { type: "application/pdf" })] } });
    expect(await screen.findByRole("alert")).toHaveTextContent("JPG, PNG or WebP");

    fireEvent.change(input, { target: { files: [new File(["x"], "hero.jpg", { type: "image/jpeg" })] } });
    await waitFor(() => expect(svc.uploadHeroImage).toHaveBeenCalled());
    expect((svc.uploadHeroImage.mock.calls[0][0] as FormData).get("image")).toBeInstanceOf(File);
  });

  it("can go back to the style's own photo", async () => {
    svc.getWorkspace.mockResolvedValue({ data: { theme: { bannerUrl: "/landing/fine-dining/hero.jpg" }, gallery: [] } });
    render(<HeroImagePanel disabled={false} />);
    fireEvent.click(await screen.findByRole("button", { name: "Use style's photo" }));
    await waitFor(() => expect(svc.chooseHeroImage).toHaveBeenCalledWith(null));
  });
});
