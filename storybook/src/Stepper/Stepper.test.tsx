import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Stepper from "./Stepper";

describe("Stepper", () => {
  it("renders the numeric field with the value", () => {
    render(<Stepper label="Pain" defaultValue={4} minValue={0} maxValue={10} step={1} />);
    expect(screen.getByRole("textbox", { name: "Pain" })).toHaveValue("4");
  });

  it("increments and decrements via the steppers", async () => {
    const onChange = vi.fn();
    render(
      <Stepper label="Pain" value={4} onChange={onChange} minValue={0} maxValue={10} step={1} />
    );
    await userEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(5);
    await userEvent.click(screen.getByRole("button", { name: /decrease/i }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("clamps to the max", async () => {
    const onChange = vi.fn();
    render(
      <Stepper label="Pain" value={10} onChange={onChange} minValue={0} maxValue={10} step={1} />
    );
    await userEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("step mode keeps the value read-only but still steps", async () => {
    const onChange = vi.fn();
    render(
      <Stepper label="Pain" mode="step" value={4} onChange={onChange} minValue={0} maxValue={10} step={1} />
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    await userEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(5);
  });
});
