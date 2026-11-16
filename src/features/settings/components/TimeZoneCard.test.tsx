import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateWorkspace = vi.fn();
const toastError = vi.fn();
vi.mock("@/services/workspace.service", () => ({ workspaceService: { updateWorkspace: (...a: unknown[]) => updateWorkspace(...a) } }));
vi.mock("@/components/ui", async (orig) => {
  const actual = await orig<typeof import("@/components/ui")>();
  return { ...actual, toast: { success: vi.fn(), error: (...a: unknown[]) => toastError(...a) } };
});

import { modernZone, TimeZoneCard } from "./TimeZoneCard";

describe("TimeZoneCard", () => {
  beforeEach(() => {
    updateWorkspace.mockReset();
    toastError.mockReset();
  });

  it("saves the chosen zone and refreshes", async () => {
    updateWorkspace.mockResolvedValue({});
    const onSaved = vi.fn();
    render(<TimeZoneCard value="UTC" onSaved={onSaved} />);

    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Restaurant time zone"), { target: { value: "Asia/Kolkata" } });
    fireEvent.click(save);

    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(updateWorkspace).toHaveBeenCalledWith({ timezone: "Asia/Kolkata" });
  });

  it("lists cities by their current names (Kolkata, not Calcutta)", () => {
    render(<TimeZoneCard value="UTC" onSaved={vi.fn()} />);
    const values = Array.from((screen.getByLabelText("Restaurant time zone") as HTMLSelectElement).options).map((o) => o.value);
    expect(values).toContain("Asia/Kolkata");
    expect(values).not.toContain("Asia/Calcutta");
    expect(modernZone("Europe/Kiev")).toBe("Europe/Kyiv");
    expect(modernZone("Asia/Dubai")).toBe("Asia/Dubai");
  });

  it("shows a stored legacy name as the modern one without marking it changed", () => {
    render(<TimeZoneCard value="Asia/Calcutta" onSaved={vi.fn()} />);
    expect(screen.getByLabelText("Restaurant time zone")).toHaveValue("Asia/Kolkata");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("keeps the selection and reports the error when saving fails", async () => {
    updateWorkspace.mockRejectedValue(new Error("boom"));
    const onSaved = vi.fn();
    render(<TimeZoneCard value="UTC" onSaved={onSaved} />);
    fireEvent.change(screen.getByLabelText("Restaurant time zone"), { target: { value: "Asia/Dubai" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(onSaved).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Restaurant time zone")).toHaveValue("Asia/Dubai");
  });
});
