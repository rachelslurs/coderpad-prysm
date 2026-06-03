import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Card from "./Card";

describe("Card", () => {
  it("renders children on a bordered surface", () => {
    render(<Card>Body</Card>);
    const el = screen.getByText("Body");
    expect(el.className).toContain("border-neutral-200");
    expect(el.className).toContain("p-4");
  });

  it("omits padding when padding='none'", () => {
    render(<Card padding="none">Body</Card>);
    expect(screen.getByText("Body").className).not.toContain("p-4");
  });

  it("renders as a custom element", () => {
    render(<Card as="section">Body</Card>);
    expect(screen.getByText("Body").tagName).toBe("SECTION");
  });
});
