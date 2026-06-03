import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AlertOctagon } from "lucide-react";
import Badge from "./Badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>Stable</Badge>);
    expect(screen.getByText("Stable")).toBeInTheDocument();
  });

  it("applies tone classes", () => {
    render(<Badge tone="danger">Critical</Badge>);
    // The label text node is wrapped; the badge container carries the tone class.
    const container = screen.getByText("Critical").closest("span")?.parentElement;
    expect(container?.className).toContain("bg-danger-50");
  });

  it("renders an optional decorative icon", () => {
    const { container } = render(
      <Badge tone="danger" icon={AlertOctagon}>
        Critical
      </Badge>
    );
    expect(container.querySelector("svg[aria-hidden='true']")).toBeTruthy();
  });

  it("omits the icon when none is provided", () => {
    const { container } = render(<Badge>Plain</Badge>);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("adds group-hover hooks only when interactive", () => {
    const { rerender, container } = render(<Badge tone="warning">x</Badge>);
    expect(container.firstElementChild?.className).not.toContain("group-hover");
    rerender(
      <Badge tone="warning" interactive>
        x
      </Badge>
    );
    expect(container.firstElementChild?.className).toContain("group-hover");
  });
});
