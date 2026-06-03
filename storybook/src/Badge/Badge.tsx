import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Tone } from "../types";

// Generic status pill. Color is keyed to a semantic `tone`, not to any domain
// concept — any "labelled chip" (status, category, count, severity) is a Badge.
// Redundant encoding (color + optional icon + text) keeps it WCAG-friendly: the
// label carries meaning even without color.
const BASE =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded border px-2.5 py-1 text-base font-medium transition-all";

// Literal per-tone class strings (Tailwind only generates classes it can see as
// whole strings — these can't be built dynamically).
const TONE: Record<Tone, string> = {
  neutral: "border-neutral-200 bg-neutral-50 text-neutral-900",
  accent: "border-accent-200 bg-accent-50 text-accent-900",
  info: "border-info-200 bg-info-50 text-info-900",
  success: "border-success-200 bg-success-50 text-success-900",
  warning: "border-warning-200 bg-warning-50 text-warning-900",
  danger: "border-danger-200 bg-danger-50 text-danger-900",
};

// When `interactive`, the badge deepens on hover of an ancestor `.group` (e.g. a
// table row) — the same redundant-encoding hooks the roster relies on.
const TONE_INTERACTIVE: Record<Tone, string> = {
  neutral:
    "group-hover:border-neutral-400 group-hover:bg-neutral-100 group-hover:ring-1 group-hover:ring-neutral-400",
  accent:
    "group-hover:border-accent-400 group-hover:bg-accent-100 group-hover:ring-1 group-hover:ring-accent-400",
  info: "group-hover:border-info-400 group-hover:bg-info-100 group-hover:ring-1 group-hover:ring-info-400",
  success:
    "group-hover:border-success-400 group-hover:bg-success-100 group-hover:ring-1 group-hover:ring-success-400",
  warning:
    "group-hover:border-warning-400 group-hover:bg-warning-100 group-hover:ring-1 group-hover:ring-warning-400",
  danger:
    "group-hover:border-danger-400 group-hover:bg-danger-100 group-hover:ring-1 group-hover:ring-danger-400",
};

export type BadgeProps = {
  /** Semantic color tone. Defaults to `neutral`. */
  tone?: Tone;
  /** Optional leading icon (inherits the label color via `currentColor`). */
  icon?: LucideIcon;
  /** Deepen on ancestor `.group` hover. */
  interactive?: boolean;
  children: ReactNode;
};

export default function Badge({
  tone = "neutral",
  icon: Icon,
  interactive = false,
  children,
}: BadgeProps) {
  return (
    <span
      className={`${BASE} ${TONE[tone]}${interactive ? ` ${TONE_INTERACTIVE[tone]}` : ""}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
