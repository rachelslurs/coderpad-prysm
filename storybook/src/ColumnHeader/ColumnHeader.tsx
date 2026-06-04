import type { KeyboardEvent, ReactNode } from "react";
import { SortIndicator } from "../SortIndicator";

export type SortDirection = "asc" | "desc";

export type ColumnHeaderProps = {
  /** Header label. */
  children: ReactNode;
  /** Provide to make the column sortable — also wires keyboard + aria-sort. */
  onSort?: () => void;
  /** Whether this column is the active sort (only meaningful when sortable). */
  active?: boolean;
  /** Active sort direction (only meaningful when `active`). Sets `aria-sort` and
   *  the SortIndicator. Defaults to `asc`. */
  direction?: SortDirection;
  className?: string;
};

const BASE =
  "bg-white px-6 py-4 text-left text-lg font-bold whitespace-nowrap transition-colors";
const STATIC = `${BASE} border-b-2 border-neutral-200 text-neutral-700`;
const ACTIVE = `${BASE} border-b-2 border-accent-500 bg-accent-50/60 text-accent-700`;
// Click + keyboard live on the <th> itself so the whole cell is the hit target.
const INTERACTIVE =
  "cursor-pointer select-none hover:text-accent-700 focus:outline-none focus-visible:bg-accent-100 focus-visible:text-accent-800 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-accent-700";

// A table column header. Static by default; pass `onSort` to make it sortable,
// which adds the sort affordance (indicator), aria-sort, and Enter/Space support.
export default function ColumnHeader({
  children,
  onSort,
  active = false,
  direction = "asc",
  className = "",
}: ColumnHeaderProps) {
  if (!onSort) {
    return (
      <th scope="col" className={`${STATIC} ${className}`.trim()}>
        {children}
      </th>
    );
  }

  const ariaSort = active
    ? direction === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      tabIndex={0}
      onClick={onSort}
      onKeyDown={(e: KeyboardEvent<HTMLTableCellElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSort();
        }
      }}
      className={`${active ? ACTIVE : STATIC} ${INTERACTIVE} ${className}`.trim()}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span>{children}</span>
        <SortIndicator active={active} dir={direction} />
      </span>
    </th>
  );
}
