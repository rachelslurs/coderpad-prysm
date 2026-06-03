import { ChevronUp, ChevronDown } from "lucide-react";

export type SortIndicatorProps = {
  /** Whether this column is the active sort. */
  active?: boolean;
  /** Active direction. */
  dir?: "asc" | "desc";
};

// Stacked chevrons so both directions are always visible — the active one lights
// up (accent), the other stays muted. Reads more clearly than a single arrow that
// swaps in/out. Purely decorative (aria-hidden); the sortable header conveys
// state via aria-sort.
export default function SortIndicator({
  active = false,
  dir = "asc",
}: SortIndicatorProps) {
  const ascActive = active && dir === "asc";
  const descActive = active && dir === "desc";
  return (
    <span aria-hidden="true" className="ml-1 inline-flex flex-col leading-none">
      <ChevronUp
        className={`h-4 w-4 ${ascActive ? "text-accent-800" : "text-neutral-400"}`}
      />
      <ChevronDown
        className={`-mt-1.5 h-4 w-4 ${descActive ? "text-accent-800" : "text-neutral-400"}`}
      />
    </span>
  );
}
