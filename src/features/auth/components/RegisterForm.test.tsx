import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";

// Step changes finish instantly, so no animation is cancelled half-way when a test unmounts.
MotionGlobalConfig.skipAnimations = true;

const push = vi.hoisted(() => vi.fn());
const search = vi.hoisted(() => ({ value: new URLSearchParams() }));
const auth = vi.hoisted(() => ({ register: vi.fn(), verifyOtp: vi.fn(), resendOtp: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => search.value,
}));
vi.mock("@/services/auth.service", () => ({ authService: auth }));

import { RegisterForm } from "./RegisterForm";
import { AuthPreviewProvider, useAuthPreview } from "../context/AuthPreviewContext";

function PreviewProbe() {
  return <output data-testid="preview">{useAuthPreview().businessName}</output>;
}

function fill() {
  fireEvent.change(screen.getByLabelText("Restaurant name"), { target: { value: "Spice Garden" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "Owner@Spice.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } });
}

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    search.value = new URLSearchParams();
    auth.resendOtp.mockResolvedValue({});
  });

  it("previews the website address and shares the name with the scene", () => {
    render(
      <AuthPreviewProvider>
        <RegisterForm />
        <PreviewProbe />
      </AuthPreviewProvider>,
    );
    fireEvent.change(screen.getByLabelText("Restaurant name"), { target: { value: "Spice Garden" } });
    expect(screen.getByText(/Your website:/).textContent).toContain("spice-garden-xxxxxx.feastowl.com");
    expect(screen.getByTestId("preview")).toHaveTextContent("Spice Garden");
  });

  it("offers sign-in when the email already has an account, and keeps the message on screen", async () => {
    auth.register.mockRejectedValue({ response: { status: 409, data: { code: "EMAIL_ALREADY_REGISTERED", error: "exists" } } });
    render(<RegisterForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(await screen.findByText("An account already uses this email.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in instead" })).toHaveAttribute("href", "/login");
  });

  it("goes to the code step, confirms the code and shows the real address and starter menu", async () => {
    auth.register.mockResolvedValue({ data: { slug: "spice-garden-k3x9qd", businessName: "Spice Garden", templateSeeded: { itemsCount: 24 } } });
    auth.verifyOtp.mockResolvedValue({ data: { user: { role: "admin" } } });
    render(<RegisterForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("heading", { name: "Check your email" })).toBeInTheDocument();
    expect(auth.register).toHaveBeenCalledWith({ businessName: "Spice Garden", email: "owner@spice.com", password: "secret123" });
    expect(screen.getByText("ow•••@spice.com")).toBeInTheDocument();

    // A pasted code submits on its own.
    await act(async () => {
      fireEvent.paste(screen.getAllByRole("textbox")[0], { clipboardData: { getData: () => "123456" } });
    });
    await waitFor(() => expect(auth.verifyOtp).toHaveBeenCalledWith({ email: "owner@spice.com", otp: "123456" }));

    expect(await screen.findByRole("heading", { name: "You’re all set" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "spice-garden-k3x9qd.feastowl.com" })).toBeInTheDocument();
    expect(screen.getByText(/starter menu with 24 dishes/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Go to your dashboard" }));
    expect(push).toHaveBeenCalled();
  });

  it("shows a wrong code as an error that stays", async () => {
    search.value = new URLSearchParams("verify=owner@spice.com");
    auth.verifyOtp.mockRejectedValue({ response: { status: 400, data: { error: "That code is not valid." } } });
    render(<RegisterForm />);
    await act(async () => {
      fireEvent.paste(screen.getAllByRole("textbox")[0], { clipboardData: { getData: () => "000000" } });
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("That code is not valid.");
  });

  it("shows an error notice if sending the initial verification code fails", async () => {
    search.value = new URLSearchParams("verify=owner@spice.com");
    auth.resendOtp.mockRejectedValue({ response: { status: 429, data: { error: "Too many requests." } } });
    render(<RegisterForm />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many requests.");
  });
});
