import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge, toInitials } from "@prysm/design-system";

// Concrete proof the monorepo wiring works end to end: the app resolves and
// renders generic primitives/helpers from the @prysm/design-system workspace
// package, not from a local relative path.
describe("@prysm/design-system wiring", () => {
  it("renders a Badge imported from the package", () => {
    render(<Badge tone="danger">Critical</Badge>);
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("re-exports generic helpers from the package", () => {
    expect(toInitials("Margaret Holloway")).toBe("MH");
  });
});
