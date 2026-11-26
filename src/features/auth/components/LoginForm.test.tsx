import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const push = vi.hoisted(() => vi.fn());
const search = vi.hoisted(() => ({ value: new URLSearchParams() }));
const auth = vi.hoisted(() => ({ login: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => search.value,
}));
vi.mock("@/services/auth.service", () => ({ authService: auth }));

import { LoginForm } from "./LoginForm";

function signIn() {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@spice.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    search.value = new URLSearchParams();
  });

  it("explains why the person is here after a sign-out, expired session, or password change", () => {
    search.value = new URLSearchParams("reason=session_expired");
    const { unmount } = render(<LoginForm />);
    expect(screen.getByText(/You were signed out/)).toBeInTheDocument();
    unmount();
    search.value = new URLSearchParams("reason=logged_out");
    const { unmount: unmountLoggedOut } = render(<LoginForm />);
    expect(screen.getByText(/You signed out\./)).toBeInTheDocument();
    unmountLoggedOut();
    search.value = new URLSearchParams("reason=password_reset");
    render(<LoginForm />);
    expect(screen.getByText(/Password changed/)).toBeInTheDocument();
  });

  it("keeps the button in a loading redirecting state after sign-in succeeds", async () => {
    auth.login.mockResolvedValue({ data: { user: { role: "admin", permissions: null } } });
    render(<LoginForm />);
    signIn();
    const btn = await screen.findByRole("button", { name: "Redirecting…" });
    expect(btn).toBeDisabled();
    expect(push).toHaveBeenCalled();
  });

  it("shows a failed sign-in as an error on the page", async () => {
    auth.login.mockRejectedValue({ response: { status: 401, data: { error: "Wrong email or password." } } });
    render(<LoginForm />);
    signIn();
    expect(await screen.findByRole("alert")).toHaveTextContent("Wrong email or password.");
  });

  it("replaces any prior sign-out reason notice with a single error message on failed sign-in", async () => {
    search.value = new URLSearchParams("reason=session_expired");
    auth.login.mockRejectedValue({ response: { status: 401, data: { error: "Invalid email or password." } } });
    render(<LoginForm />);
    expect(screen.getByText(/You were signed out/)).toBeInTheDocument();

    signIn();

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password.");
    expect(screen.queryByText(/You were signed out/)).not.toBeInTheDocument();
  });

  it("sends an unconfirmed account to the code step", async () => {
    auth.login.mockRejectedValue({ response: { status: 403, data: { success: false, code: "ACCOUNT_INACTIVE", details: { email: "owner@spice.com" } } } });
    render(<LoginForm />);
    signIn();
    await vi.waitFor(() => expect(push).toHaveBeenCalledWith("/register?verify=owner%40spice.com"));
  });

  it("has a Show button on the password and points new owners at the free trial", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /show password/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start your 14-day free trial" })).toHaveAttribute("href", "/register");
  });
});
