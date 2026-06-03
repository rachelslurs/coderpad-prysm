import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OverlayPanel from "./OverlayPanel";

describe("OverlayPanel", () => {
  it("renders children and forwards role/aria/data-*", () => {
    render(
      <OverlayPanel
        onClose={() => {}}
        role="region"
        aria-label="Details"
        data-testid="panel"
      >
        <p>Body</p>
      </OverlayPanel>
    );
    const panel = screen.getByTestId("panel");
    expect(panel).toHaveAttribute("role", "region");
    expect(panel).toHaveAttribute("aria-label", "Details");
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("moves focus to the first focusable element on open", () => {
    render(
      <OverlayPanel onClose={() => {}}>
        <button>First</button>
      </OverlayPanel>
    );
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
  });

  it("calls onClose on Escape", () => {
    const onClose = vi.fn();
    render(
      <OverlayPanel onClose={onClose}>
        <button>x</button>
      </OverlayPanel>
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
