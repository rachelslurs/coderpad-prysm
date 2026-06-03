import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Segmented from "./Segmented";

const ADL = ["None", "Assist ×1", "Assist ×2", "Total"];

describe("Segmented", () => {
  it("renders a radiogroup with one radio per option", () => {
    render(<Segmented label="ADL level" options={ADL} />);
    expect(screen.getByRole("radiogroup", { name: "ADL level" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(ADL.length);
  });

  it("selects on click and reports the value", async () => {
    const onChange = vi.fn();
    render(<Segmented label="ADL level" options={ADL} onChange={onChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Total" }));
    expect(onChange).toHaveBeenCalledWith("Total");
  });

  it("reflects the controlled value as checked", () => {
    render(<Segmented label="ADL level" options={ADL} value="Assist ×1" />);
    expect(screen.getByRole("radio", { name: "Assist ×1" })).toBeChecked();
  });
});
