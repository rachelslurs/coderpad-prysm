import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Stethoscope } from "lucide-react";
import IconTile from "./IconTile";

describe("IconTile", () => {
  it("renders a decorative icon", () => {
    const { container } = render(<IconTile icon={Stethoscope} />);
    expect(container.querySelector("svg[aria-hidden='true']")).toBeTruthy();
  });

  it("applies tone classes", () => {
    const { container } = render(<IconTile icon={Stethoscope} tone="success" />);
    expect(container.firstElementChild?.className).toContain("bg-success-50");
  });
});
