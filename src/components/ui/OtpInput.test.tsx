import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OtpInput } from "./OtpInput";

function Harness({ onComplete }: { onComplete?: (v: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <>
      <OtpInput id="otp" label="6-digit code" value={value} onChange={setValue} onComplete={onComplete} />
      <output data-testid="value">{value}</output>
    </>
  );
}

const boxes = () => screen.getAllByRole("textbox");

describe("OtpInput", () => {
  it("renders one labelled box per digit inside a named group", () => {
    render(<Harness />);
    expect(screen.getByRole("group", { name: "6-digit code" })).toBeInTheDocument();
    expect(boxes()).toHaveLength(6);
    expect(boxes()[0]).toHaveAttribute("id", "otp");
    expect(boxes()[0]).toHaveAttribute("autocomplete", "one-time-code");
  });

  it("moves to the next box as digits are typed and ignores letters", () => {
    render(<Harness />);
    fireEvent.change(boxes()[0], { target: { value: "4" } });
    expect(boxes()[1]).toHaveFocus();
    fireEvent.change(boxes()[1], { target: { value: "x" } });
    expect(screen.getByTestId("value")).toHaveTextContent(/^4$/);
  });

  it("fills every box from a pasted code and reports it complete", () => {
    const onComplete = vi.fn();
    render(<Harness onComplete={onComplete} />);
    fireEvent.paste(boxes()[2], { clipboardData: { getData: () => " 482-913 " } });
    expect(boxes().map((b) => (b as HTMLInputElement).value).join("")).toBe("482913");
    expect(onComplete).toHaveBeenCalledWith("482913");
  });

  it("takes a whole autofilled code typed into the first box", () => {
    render(<Harness />);
    fireEvent.change(boxes()[0], { target: { value: "123456" } });
    expect(screen.getByTestId("value")).toHaveTextContent("123456");
  });

  it("never leaves a gap: a digit typed further along lands in the first empty box", () => {
    render(<Harness />);
    fireEvent.change(boxes()[0], { target: { value: "1" } });
    fireEvent.change(boxes()[4], { target: { value: "2" } });
    expect(screen.getByTestId("value")).toHaveTextContent(/^12$/);
  });

  it("Backspace on an empty box clears the one before and moves back", () => {
    render(<Harness />);
    fireEvent.change(boxes()[0], { target: { value: "12" } });
    fireEvent.keyDown(boxes()[2], { key: "Backspace" });
    expect(screen.getByTestId("value")).toHaveTextContent(/^1$/);
    expect(boxes()[1]).toHaveFocus();
  });
});
