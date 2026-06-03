import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusBadge from "./StatusBadge";
import type { PatientStatus } from "../types";

const STATUSES: PatientStatus[] = ["Stable", "Needs Attention", "Critical"];

describe("StatusBadge", () => {
  it.each(STATUSES)("renders the %s label", (status) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(status)).toBeInTheDocument();
  });

  it("pairs the label with a decorative icon (color is not the only cue)", () => {
    const { container } = render(<StatusBadge status="Critical" />);
    expect(container.querySelector("svg[aria-hidden='true']")).toBeTruthy();
  });
});
