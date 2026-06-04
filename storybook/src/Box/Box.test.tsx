import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Box from "./Box";

describe("Box", () => {
  it("resolves padding and borderWidth scale tokens to whole-literal classes", () => {
    render(
      <Box padding={4} borderWidth={2}>
        Body
      </Box>,
    );
    const el = screen.getByText("Body");
    expect(el.className).toContain("p-4");
    expect(el.className).toContain("border-2");
  });

  it("defaults to padding 6 and a 1px border, with no background", () => {
    render(<Box>Body</Box>);
    const el = screen.getByText("Body");
    expect(el.className).toContain("p-6");
    expect(el.className).toContain("border");
    expect(el.className).not.toContain("bg-");
  });

  it("appends consumer className last so theme styles win", () => {
    render(<Box className="bg-accent-50">Body</Box>);
    expect(screen.getByText("Body").className.endsWith("bg-accent-50")).toBe(true);
  });

  it("renders as a custom element", () => {
    render(<Box as="section">Body</Box>);
    expect(screen.getByText("Body").tagName).toBe("SECTION");
  });

  it("adds the invert treatment only when requested", () => {
    const { rerender } = render(<Box>Body</Box>);
    expect(screen.getByText("Body").className).not.toContain("invert");
    rerender(<Box invert>Body</Box>);
    expect(screen.getByText("Body").className).toContain("invert");
  });
});
