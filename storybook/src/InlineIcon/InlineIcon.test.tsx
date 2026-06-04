import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Check } from "lucide-react";
import InlineIcon from "./InlineIcon";

describe("InlineIcon", () => {
  it("renders the lucide glyph sized to cap height", () => {
    const { container } = render(<InlineIcon icon={Check} label="Done" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toBeTruthy();
    expect(svg.getAttribute("class")).toContain("h-[1cap]");
    expect(svg.getAttribute("class")).toContain("w-[1cap]");
  });

  it("exposes an accessible name when label is set", () => {
    render(<InlineIcon icon={Check} label="Done" />);
    const el = screen.getByRole("img", { name: "Done" });
    expect(el.tagName).toBe("SPAN");
  });

  it("is decorative (aria-hidden, no role) without a label", () => {
    const { container } = render(<InlineIcon icon={Check} />);
    const span = container.querySelector("span")!;
    expect(span.getAttribute("role")).toBeNull();
    expect(span.getAttribute("aria-hidden")).toBe("true");
  });

  it("adds margin spacing only when space is set", () => {
    const { container, rerender } = render(<InlineIcon icon={Check} label="x" />);
    expect(container.querySelector("span")!.className).not.toContain("me-");
    rerender(<InlineIcon icon={Check} label="x" space={2} />);
    expect(container.querySelector("span")!.className).toContain("me-2");
  });

  it("appends consumer className last so theme styles win", () => {
    const { container } = render(<InlineIcon icon={Check} className="text-accent-600" />);
    expect(container.querySelector("span")!.className.endsWith("text-accent-600")).toBe(true);
  });
});
