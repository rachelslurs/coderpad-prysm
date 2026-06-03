import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Toggle from "./Toggle";

describe("Toggle", () => {
  it("renders a switch with its label", () => {
    render(<Toggle>Bed rails up</Toggle>);
    expect(screen.getByRole("switch", { name: "Bed rails up" })).toBeInTheDocument();
  });

  it("toggles on click and reports the new state", async () => {
    const onChange = vi.fn();
    render(<Toggle onChange={onChange}>Bathing complete</Toggle>);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", async () => {
    const onChange = vi.fn();
    render(
      <Toggle isDisabled onChange={onChange}>
        NPO order
      </Toggle>
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
