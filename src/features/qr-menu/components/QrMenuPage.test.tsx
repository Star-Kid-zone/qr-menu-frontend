import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const svc = vi.hoisted(() => ({ getWorkspace: vi.fn(), updateWorkspace: vi.fn(), checkSlugAvailability: vi.fn(), updateSlug: vi.fn() }));
const perms = vi.hoisted(() => ({ canEditWebsite: true, hasPermission: vi.fn(() => true) }));
vi.mock("@/services/workspace.service", () => ({ workspaceService: svc }));
vi.mock("@/hooks/usePermissions", () => ({ usePermissions: () => perms }));
vi.mock("@/components/ui/toast", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/components/auth/PermissionGuard", () => ({
  PermissionGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { QrMenuPage } from "./QrMenuPage";

const ws = { workspaceId: "ws-1", publicSlug: "roma", theme: {}, business: { name: "Pizza Roma" }, qrCode: {} };

describe("QrMenuPage", () => {
  beforeEach(() => {
    Object.values(svc).forEach((f) => f.mockReset());
    perms.hasPermission.mockReturnValue(true);
  });

  it("loads the workspace once and shows the address and the designer", async () => {
    svc.getWorkspace.mockResolvedValue({ data: ws });
    render(<QrMenuPage />);
    expect(await screen.findByText("Design and print")).toBeInTheDocument();
    expect(screen.getByText(/Guests open your menu at/)).toBeInTheDocument();
    expect(svc.getWorkspace).toHaveBeenCalledTimes(1);
  });

  it("asks for an address before showing the designer", async () => {
    svc.getWorkspace.mockResolvedValue({ data: { ...ws, publicSlug: "" } });
    render(<QrMenuPage />);
    expect(await screen.findByText("Your QR code comes next")).toBeInTheDocument();
    expect(screen.queryByText("Design and print")).toBeNull();
  });

  it("hides the designer without QR access", async () => {
    perms.hasPermission.mockReturnValue(false);
    svc.getWorkspace.mockResolvedValue({ data: ws });
    render(<QrMenuPage />);
    expect(await screen.findByText(/don.t have access to download QR codes/)).toBeInTheDocument();
  });

  it("shows the error and retries", async () => {
    svc.getWorkspace.mockRejectedValueOnce(new Error("down")).mockResolvedValueOnce({ data: ws });
    render(<QrMenuPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Design and print")).toBeInTheDocument();
  });
});
