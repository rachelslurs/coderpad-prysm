import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Skeleton from "./Skeleton";

describe("Skeleton", () => {
  it("renders a labelled status region", () => {
    render(<Skeleton width={100} height={12} />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("sizes from props and rounds fully when circle", () => {
    render(<Skeleton circle height={40} label="avatar" />);
    const el = screen.getByRole("status", { name: "avatar" });
    expect(el).toHaveStyle({ width: "40px", height: "40px", borderRadius: "9999px" });
  });
});
