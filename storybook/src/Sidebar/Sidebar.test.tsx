import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Sidebar from "./Sidebar";

const children = (
  <>
    <div>side</div>
    <div>main</div>
  </>
);

describe("Sidebar", () => {
  it("wraps a flex row and resolves tokens to whole-literal classes", () => {
    render(
      <Sidebar sideWidth={32} contentMin="3/5" space={4}>
        {children}
      </Sidebar>,
    );
    const el = screen.getByText("side").parentElement!;
    expect(el.className).toContain("flex");
    expect(el.className).toContain("flex-wrap");
    expect(el.className).toContain("gap-4");
    expect(el.className).toContain("[&>*]:basis-32");
    expect(el.className).toContain("[&>:last-child]:min-w-[60%]");
  });

  it("targets the last child as content when side is left", () => {
    render(<Sidebar>{children}</Sidebar>);
    const el = screen.getByText("side").parentElement!;
    expect(el.className).toContain("[&>:last-child]:grow-[999]");
    expect(el.className).toContain("[&>:last-child]:min-w-[50%]");
  });

  it("targets the first child as content when side is right", () => {
    render(<Sidebar side="right">{children}</Sidebar>);
    expect(screen.getByText("side").parentElement!.className).toContain(
      "[&>:first-child]:grow-[999]",
    );
  });

  it("omits the rail-width class when sideWidth is not set, and adds items-start for noStretch", () => {
    render(<Sidebar noStretch>{children}</Sidebar>);
    const el = screen.getByText("side").parentElement!;
    expect(el.className).not.toContain("[&>*]:basis-");
    expect(el.className).toContain("items-start");
  });

  it("appends consumer className last so theme styles win", () => {
    render(<Sidebar className="bg-accent-50">{children}</Sidebar>);
    expect(screen.getByText("side").parentElement!.className.endsWith("bg-accent-50")).toBe(true);
  });
});
