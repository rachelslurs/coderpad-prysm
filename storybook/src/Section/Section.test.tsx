import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Section from "./Section";

describe("Section", () => {
  it("renders a heading when titled", () => {
    render(<Section title="Admin">body</Section>);
    expect(screen.getByRole("heading", { name: "Admin" })).toBeInTheDocument();
  });

  it("omits the heading when untitled", () => {
    render(<Section>body</Section>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });
});
