import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const svc = vi.hoisted(() => ({
  listDomains: vi.fn(),
  addDomain: vi.fn(),
  removeDomain: vi.fn(),
  verifyDomain: vi.fn(),
}));
vi.mock("@/services/workspace.service", () => ({ workspaceService: svc }));
vi.mock("@/components/ui", async (orig) => {
  const actual = await orig<typeof import("@/components/ui")>();
  return { ...actual, toast: { success: vi.fn(), error: vi.fn() } };
});

import { CustomDomainsCard } from "./CustomDomainsCard";

const pending = {
  id: "1",
  domain: "www.pizzaroma.com",
  verified: false,
  verifiedAt: null,
  lastCheckedAt: null,
  dns: { txt: { name: "_feastowl-verify.www.pizzaroma.com", value: "feastowl-abc" }, cname: { name: "www.pizzaroma.com", target: "sites.feastowl.com" } },
};

describe("CustomDomainsCard", () => {
  beforeEach(() => Object.values(svc).forEach((f) => f.mockReset()));

  it("shows the free address and a pending domain's DNS records", async () => {
    svc.listDomains.mockResolvedValue({ data: [pending] });
    render(<CustomDomainsCard publicSlug="vimal" />);
    expect(screen.getByRole("link", { name: /vimal\./ })).toBeInTheDocument();
    const row = within(await screen.findByRole("list", { name: "Your domains" })).getByRole("listitem");
    expect(within(row).getByText("Waiting for DNS")).toBeInTheDocument();
    expect(within(row).getByText("feastowl-abc")).toBeInTheDocument();
    expect(within(row).getByText("sites.feastowl.com")).toBeInTheDocument();
  });

  it("adds a domain and shows the server's error when it's refused", async () => {
    svc.listDomains.mockResolvedValue({ data: [] });
    svc.addDomain.mockRejectedValueOnce({ response: { data: { error: "That address belongs to the platform." } } });
    render(<CustomDomainsCard publicSlug="vimal" />);
    fireEvent.change(screen.getByLabelText("Your domain"), { target: { value: "vimal.feastowl.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Add domain" }));
    expect(await screen.findByText(/belongs to the platform|Couldn't add/)).toBeInTheDocument();

    svc.addDomain.mockResolvedValueOnce({ data: pending });
    fireEvent.change(screen.getByLabelText("Your domain"), { target: { value: "www.pizzaroma.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Add domain" }));
    await waitFor(() => expect(svc.addDomain).toHaveBeenLastCalledWith("www.pizzaroma.com"));
    await waitFor(() => expect(svc.listDomains).toHaveBeenCalledTimes(2));
  });

  it("explains a failed check", async () => {
    svc.listDomains.mockResolvedValue({ data: [pending] });
    svc.verifyDomain.mockResolvedValue({ data: { domain: pending, reason: "We couldn't find the TXT record yet." } });
    render(<CustomDomainsCard publicSlug="vimal" />);
    fireEvent.click(await screen.findByRole("button", { name: "Check now" }));
    expect(await screen.findByRole("status")).toHaveTextContent("couldn't find the TXT record");
  });

  it("removes a domain only after confirmation", async () => {
    svc.listDomains.mockResolvedValue({ data: [{ ...pending, verified: true, verifiedAt: "2026-11-09T00:00:00Z" }] });
    svc.removeDomain.mockResolvedValue({ data: { removed: true } });
    render(<CustomDomainsCard publicSlug="vimal" />);
    fireEvent.click(await screen.findByRole("button", { name: "Remove www.pizzaroma.com" }));
    expect(svc.removeDomain).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByRole("button", { name: "Remove" }));
    await waitFor(() => expect(svc.removeDomain).toHaveBeenCalledWith("1"));
  });
});
