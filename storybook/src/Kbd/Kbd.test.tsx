import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Kbd from "./Kbd";

describe("Kbd", () => {
  it("renders a <kbd> with its content", () => {
    render(<Kbd>ESC</Kbd>);
    const el = screen.getByText("ESC");
    expect(el.tagName).toBe("KBD");
  });

  it("forwards extra attributes (e.g. aria-hidden, className)", () => {
    render(
      <Kbd aria-hidden="true" className="custom">
        /
      </Kbd>
    );
    const el = screen.getByText("/");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el.className).toContain("custom");
  });
});
