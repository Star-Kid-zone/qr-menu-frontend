import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkspaceData } from "@/types";

const svc = vi.hoisted(() => ({ updateWorkspace: vi.fn() }));
vi.mock("@/services/workspace.service", () => ({ workspaceService: svc }));
vi.mock("@/components/ui/toast", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/components/auth/PermissionGuard", () => ({
  PermissionGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { QrStudio } from "./QrStudio";

function workspace(overrides: Partial<WorkspaceData> = {}): WorkspaceData {
  return {
    workspaceId: "ws-1",
    publicSlug: "roma",
    theme: { businessType: "pizzeria", primaryColor: "#aa3300" },
    business: { name: "Pizza Roma" },
    qrCode: {},
    ...overrides,
  } as unknown as WorkspaceData;
}

describe("QrStudio", () => {
  beforeEach(() => svc.updateWorkspace.mockReset().mockResolvedValue({ data: {} }));

  it("starts saved, with a table card and frames picked for the business first", () => {
    render(<QrStudio workspace={workspace()} />);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save design" })).toBeDisabled();
    expect(screen.getByRole("tab", { name: "Table card", selected: true })).toBeInTheDocument();
    const gallery = screen.getAllByRole("button", { pressed: false }).map((b) => b.getAttribute("aria-label"));
    expect(gallery).toContain("Trattoria");
    expect(screen.getByRole("button", { name: "For you", pressed: true })).toBeInTheDocument();
  });

  it("marks changes as unsaved and saves the frame, destination and URL", async () => {
    render(<QrStudio workspace={workspace()} />);
    fireEvent.click(screen.getByRole("button", { name: "Trattoria" }));
    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save design" }));
    await waitFor(() => expect(svc.updateWorkspace).toHaveBeenCalledTimes(1));
    const { qrCode } = svc.updateWorkspace.mock.calls[0][0];
    expect(qrCode.destination).toBe("menu");
    expect(qrCode.url).toMatch(/roma.*\/menu$/);
    expect(qrCode.frame).toMatchObject({ layout: "card", cardId: "trattoria", paper: "#FBF6EC", printSize: "a6" });
    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
  });

  it("asks before discarding and goes back to the last save", async () => {
    render(<QrStudio workspace={workspace()} />);
    fireEvent.click(screen.getByRole("button", { name: "Trattoria" }));
    fireEvent.click(screen.getByRole("button", { name: "Discard" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Discard changes" }));
    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
  });

  it("switches to stickers with a sticker frame and sticker print sizes", () => {
    render(<QrStudio workspace={workspace()} />);
    fireEvent.click(screen.getByRole("tab", { name: "Sticker" }));
    expect(screen.getByRole("button", { name: "Round badge", pressed: true })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /7\.5 cm/ })).toBeInTheDocument();
  });

  it("adds table numbers to the preview", () => {
    render(<QrStudio workspace={workspace()} />);
    fireEvent.click(screen.getByRole("tab", { name: "Text" }));
    fireEvent.click(screen.getByLabelText(/Print a table number on each card/));
    fireEvent.change(screen.getByLabelText("Number in preview"), { target: { value: "12" } });
    expect(screen.getByRole("img", { name: /preview/ }).textContent).toContain("Table 12");
  });

  it("warns when the code colours will not scan", () => {
    render(<QrStudio workspace={workspace()} />);
    fireEvent.click(screen.getByRole("tab", { name: "QR style" }));
    fireEvent.click(screen.getByText("Pick your own colours"));
    const dots = screen.getByText("Dots").closest("label")!.querySelector("input")!;
    fireEvent.change(dots, { target: { value: "#f5f5f5" } });
    expect(screen.getByText("May not scan")).toBeInTheDocument();
  });

  it("points the code at the website when chosen", async () => {
    render(<QrStudio workspace={workspace()} />);
    fireEvent.click(screen.getByRole("tab", { name: "Link" }));
    fireEvent.click(screen.getByRole("radio", { name: /Your website/ }));
    fireEvent.click(screen.getByRole("button", { name: "Save design" }));
    await waitFor(() => expect(svc.updateWorkspace).toHaveBeenCalled());
    expect(svc.updateWorkspace.mock.calls[0][0].qrCode).toMatchObject({ destination: "website" });
  });
});
