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

  it("step mode is a spinbutton with no freeform text input", () => {
    render(
      <Stepper label="Pain" mode="step" value={4} onChange={() => {}} minValue={0} maxValue={10} step={1} />
    );
    const spin = screen.getByRole("spinbutton", { name: "Pain" });
    expect(spin).toHaveAttribute("aria-valuenow", "4");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("step mode steps via the buttons and the arrow keys", async () => {
    const onChange = vi.fn();
    render(
      <Stepper label="Pain" mode="step" value={4} onChange={onChange} minValue={0} maxValue={10} step={1} />
    );
    await userEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(5);
    screen.getByRole("spinbutton").focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("starts 'Not set' and the first step seeds from the last reading", async () => {
    const onChange = vi.fn();
    render(
      <Stepper
        label="Temp"
        mode="step"
        value={null}
        seed={98.4}
        onChange={onChange}
        minValue={95}
        maxValue={105}
        step={0.1}
      />
    );
    const spin = screen.getByRole("spinbutton");
    expect(spin).toHaveAttribute("aria-valuetext", "Not set");
    expect(spin).not.toHaveAttribute("aria-valuenow");
    await userEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(98.4);
  });

  it("offers 'Use last' while unset", async () => {
    const onChange = vi.fn();
    render(
      <Stepper label="Temp" mode="step" value={null} seed={98.4} onChange={onChange} minValue={95} maxValue={105} step={0.1} />
    );
    await userEvent.click(screen.getByRole("button", { name: /use last/i }));
    expect(onChange).toHaveBeenCalledWith(98.4);
  });
});
