import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SortIndicator from "./SortIndicator";

describe("SortIndicator", () => {
  it("renders both chevrons and is decorative", () => {
    const { container } = render(<SortIndicator active dir="asc" />);
    expect(container.querySelectorAll("svg")).toHaveLength(2);
    expect(container.querySelector("[aria-hidden='true']")).toBeTruthy();
  });

  it("lights the active direction with the accent tone", () => {
    const { container } = render(<SortIndicator active dir="desc" />);
    const [up, down] = Array.from(container.querySelectorAll("svg"));
    expect(up.getAttribute("class")).toContain("text-neutral-400");
    expect(down.getAttribute("class")).toContain("text-accent-800");
  });
});
