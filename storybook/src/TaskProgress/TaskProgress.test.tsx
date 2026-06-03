import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TaskProgress from "./TaskProgress";

describe("TaskProgress", () => {
  it("exposes a progressbar with the right aria values", () => {
    render(<TaskProgress value={3} total={6} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuemax", "6");
  });

  it("renders the count for the ring", () => {
    render(<TaskProgress value={3} total={6} variant="ring" />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("/6")).toBeInTheDocument();
  });

  it("renders a fillable bar variant", () => {
    render(<TaskProgress value={5} total={6} variant="bar" label="Tasks" />);
    expect(screen.getByText("5 / 6")).toBeInTheDocument();
  });
});
