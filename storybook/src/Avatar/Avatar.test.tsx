import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("renders a photo when src is given", () => {
    render(<Avatar src="/x.jpg" name="Margaret Holloway" />);
    const img = screen.getByRole("img", { name: "Margaret Holloway" });
    expect(img).toHaveAttribute("src", "/x.jpg");
  });

  it("renders initials when there's no photo", () => {
    render(<Avatar name="Margaret Holloway" />);
    expect(screen.getByText("MH")).toBeInTheDocument();
  });

  it("falls back to a generic icon with a label when no name", () => {
    const { container } = render(<Avatar />);
    expect(screen.getByRole("img", { name: "No photo" })).toBeInTheDocument();
    expect(container.querySelector("svg[aria-hidden='true']")).toBeTruthy();
  });
});
