import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Cover from "./Cover";

describe("Cover", () => {
  it("is a flex column with space and minHeight resolved from tokens", () => {
    render(
      <Cover space={8} minHeight="full">
        <div>Body</div>
      </Cover>,
    );
    const el = screen.getByText("Body").parentElement!;
    expect(el.className).toContain("flex");
    expect(el.className).toContain("flex-col");
    expect(el.className).toContain("gap-8");
    expect(el.className).toContain("min-h-full");
  });

  it("pads by space by default and drops padding with noPad", () => {
    const { rerender } = render(
      <Cover space={6}>
        <div>Body</div>
      </Cover>,
    );
    expect(screen.getByText("Body").parentElement!.className).toContain("p-6");
    rerender(
      <Cover space={6} noPad>
        <div>Body</div>
      </Cover>,
    );
    const el = screen.getByText("Body").parentElement!;
    const classes = el.className.split(" ");
    expect(classes).toContain("p-0");
    expect(classes).not.toContain("p-6");
  });

  it("centres the marked child via the data-cover-center rule", () => {
    render(
      <Cover>
        <div data-cover-center>Center</div>
      </Cover>,
    );
    expect(screen.getByText("Center").parentElement!.className).toContain(
      "[&>[data-cover-center]]:my-auto",
    );
  });

  it("appends consumer className last so theme styles win", () => {
    render(
      <Cover className="bg-accent-50">
        <div>Body</div>
      </Cover>,
    );
    expect(screen.getByText("Body").parentElement!.className.endsWith("bg-accent-50")).toBe(true);
  });
});
