import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Container from "./Container";

describe("Container", () => {
  it("establishes an inline-size containment context", () => {
    render(<Container>Body</Container>);
    expect(screen.getByText("Body").className).toContain("[container-type:inline-size]");
  });

  it("sets container-name only when name is given", () => {
    const { rerender } = render(<Container>Body</Container>);
    expect(screen.getByText("Body").style.containerName).toBe("");
    rerender(<Container name="cq">Body</Container>);
    expect(screen.getByText("Body").style.containerName).toBe("cq");
  });

  it("renders as a custom element", () => {
    render(<Container as="section">Body</Container>);
    expect(screen.getByText("Body").tagName).toBe("SECTION");
  });

  it("appends consumer className last so theme styles win", () => {
    render(<Container className="bg-accent-50">Body</Container>);
    expect(screen.getByText("Body").className.endsWith("bg-accent-50")).toBe(true);
  });
});
