import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Center from "./Center";

describe("Center", () => {
  it("centres and clamps to the measure token", () => {
    render(<Center max="sm">Body</Center>);
    const el = screen.getByText("Body");
    expect(el.className).toContain("mx-auto");
    expect(el.className).toContain("max-w-sm");
  });

  it("defaults to the prose measure", () => {
    render(<Center>Body</Center>);
    expect(screen.getByText("Body").className).toContain("max-w-prose");
  });

  it("adds gutter padding only when gutters is set", () => {
    const { rerender } = render(<Center>Body</Center>);
    expect(screen.getByText("Body").className).not.toContain("px-");
    rerender(<Center gutters={4}>Body</Center>);
    expect(screen.getByText("Body").className).toContain("px-4");
  });

  it("toggles andText and intrinsic", () => {
    render(
      <Center andText intrinsic>
        Body
      </Center>,
    );
    const el = screen.getByText("Body");
    expect(el.className).toContain("text-center");
    expect(el.className).toContain("items-center");
  });

  it("appends consumer className last so theme styles win", () => {
    render(<Center className="text-accent-900">Body</Center>);
    expect(screen.getByText("Body").className.endsWith("text-accent-900")).toBe(true);
  });
});
