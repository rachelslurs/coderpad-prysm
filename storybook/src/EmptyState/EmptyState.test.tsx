import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SearchX } from "lucide-react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("renders its message inside a status region", () => {
    render(<EmptyState>Nothing here</EmptyState>);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Nothing here");
  });

  it("renders an optional decorative icon", () => {
    const { container } = render(
      <EmptyState icon={SearchX}>Empty</EmptyState>
    );
    expect(container.querySelector("svg[aria-hidden='true']")).toBeTruthy();
  });
});
