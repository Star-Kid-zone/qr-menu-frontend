import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("hides the password until Show is pressed, then hides it again", () => {
    render(<PasswordInput id="pw" aria-label="Password" autoComplete="new-password" />);
    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: /show password/i });

    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("autocomplete", "new-password");

    fireEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /hide password/i })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: /hide password/i }));
    expect(input).toHaveAttribute("type", "password");
  });
});
