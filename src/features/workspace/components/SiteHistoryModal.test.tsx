import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const listSiteVersions = vi.fn();
const restoreSiteVersion = vi.fn();
vi.mock("@/services/workspace.service", () => ({
  workspaceService: {
    listSiteVersions: (...a: unknown[]) => listSiteVersions(...a),
    restoreSiteVersion: (...a: unknown[]) => restoreSiteVersion(...a),
  },
}));
vi.mock("@/components/ui", async (orig) => {
  const actual = await orig<typeof import("@/components/ui")>();
  return { ...actual, toast: { success: vi.fn(), error: vi.fn() } };
});

import { SiteHistoryModal } from "./SiteHistoryModal";

const VERSIONS = [
  { id: "3", createdAt: "2026-11-09T10:00:00Z", createdByName: "Vimal", isCurrent: true, summary: "2 sections hidden" },
  { id: "2", createdAt: "2026-11-08T10:00:00Z", createdByName: "Vimal", isCurrent: false, summary: "Custom section order" },
  { id: "1", createdAt: "2026-11-07T10:00:00Z", createdByName: null, isCurrent: false, summary: "Default layout" },
];

describe("SiteHistoryModal", () => {
  beforeEach(() => {
    listSiteVersions.mockReset().mockResolvedValue({ data: VERSIONS });
    restoreSiteVersion.mockReset().mockResolvedValue({ data: { restored: true } });
  });

  it("lists versions and marks the live one without a restore button", async () => {
    render(<SiteHistoryModal isOpen onClose={vi.fn()} onRestored={vi.fn()} />);
    const list = await screen.findByRole("list", { name: "Saved versions" });
    const rows = within(list).getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    expect(within(rows[0]).getByText("Live now")).toBeInTheDocument();
    expect(within(rows[0]).queryByRole("button")).toBeNull();
    expect(within(rows[2]).getByText(/Default layout/)).toBeInTheDocument();
  });

  it("restores only after confirmation, then refreshes", async () => {
    const onRestored = vi.fn();
    render(<SiteHistoryModal isOpen onClose={vi.fn()} onRestored={onRestored} />);
    const list = await screen.findByRole("list", { name: "Saved versions" });
    fireEvent.click(within(within(list).getAllByRole("listitem")[2]).getByRole("button", { name: /Restore/ }));

    expect(restoreSiteVersion).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByRole("button", { name: "Restore" }));

    await waitFor(() => expect(onRestored).toHaveBeenCalled());
    expect(restoreSiteVersion).toHaveBeenCalledWith("1");
  });

  it("shows an error with a retry when the list can't load", async () => {
    listSiteVersions.mockRejectedValueOnce(new Error("down"));
    render(<SiteHistoryModal isOpen onClose={vi.fn()} onRestored={vi.fn()} />);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("list", { name: "Saved versions" })).toBeInTheDocument();
  });
});
