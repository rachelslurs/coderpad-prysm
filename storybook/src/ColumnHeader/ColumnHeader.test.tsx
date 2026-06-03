import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ColumnHeader from "./ColumnHeader";

const wrap = (node: React.ReactNode) =>
  render(
    <table>
      <thead>
        <tr>{node}</tr>
      </thead>
    </table>
  );

describe("ColumnHeader", () => {
  it("is a static column header without onSort", () => {
    wrap(<ColumnHeader>Age</ColumnHeader>);
    const th = screen.getByRole("columnheader", { name: "Age" });
    expect(th).not.toHaveAttribute("aria-sort");
    expect(th).not.toHaveAttribute("tabindex");
  });

  it("exposes aria-sort and is focusable when sortable", () => {
    wrap(
      <ColumnHeader onSort={() => {}} active direction="desc">
        Room
      </ColumnHeader>
    );
    const th = screen.getByRole("columnheader", { name: /Room/ });
    expect(th).toHaveAttribute("aria-sort", "descending");
    expect(th).toHaveAttribute("tabindex", "0");
  });

  it("reports aria-sort='none' when sortable but inactive", () => {
    wrap(
      <ColumnHeader onSort={() => {}} active={false}>
        Patient
      </ColumnHeader>
    );
    expect(screen.getByRole("columnheader", { name: /Patient/ })).toHaveAttribute(
      "aria-sort",
      "none"
    );
  });

  it("fires onSort on click and Enter/Space", () => {
    const onSort = vi.fn();
    wrap(<ColumnHeader onSort={onSort}>Room</ColumnHeader>);
    const th = screen.getByRole("columnheader", { name: /Room/ });
    fireEvent.click(th);
    fireEvent.keyDown(th, { key: "Enter" });
    fireEvent.keyDown(th, { key: " " });
    expect(onSort).toHaveBeenCalledTimes(3);
  });
});
