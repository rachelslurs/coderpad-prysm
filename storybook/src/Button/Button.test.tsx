import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ArrowLeft } from "lucide-react";
import Button from "./Button";

describe("Button", () => {
  it("renders its label and is a button by default", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("applies variant + tone classes", () => {
    render(
      <Button variant="solid" tone="danger">
        Delete
      </Button>
    );
    expect(screen.getByRole("button").className).toContain("bg-danger-600");
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders a leading icon", () => {
    const { container } = render(<Button iconLeft={ArrowLeft}>Back</Button>);
    expect(container.querySelector("svg[aria-hidden='true']")).toBeTruthy();
  });

  it("forwards data-* attributes", () => {
    render(<Button data-testid="cta">Go</Button>);
    expect(screen.getByTestId("cta")).toBeInTheDocument();
  });

  it("applies the 48px touch size", () => {
    render(<Button size="touch">Mark complete</Button>);
    expect(screen.getByRole("button").className).toContain("min-h-12");
  });
});
