import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge, toInitials } from "@prysm/design-system";

// Concrete proof the monorepo wiring works end to end: the app resolves and
// renders components/helpers from the @prysm/design-system workspace package,
// not from a local relative path.
describe("@prysm/design-system wiring", () => {
  it("renders a StatusBadge imported from the package", () => {
    render(<StatusBadge status="Critical" />);
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("re-exports formatting helpers from the package", () => {
    expect(toInitials("Margaret Holloway")).toBe("MH");
  });
});
