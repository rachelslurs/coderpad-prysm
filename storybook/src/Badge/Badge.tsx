import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Tone } from "../types";

// Generic status pill. Color is keyed to a semantic `tone`, not to any domain
// concept — any "labelled chip" (status, category, count, severity) is a Badge.
// Redundant encoding (color + optional icon + text) keeps it WCAG-friendly: the
// label carries meaning even without color.
const BASE =
  "inline-flex items-center whitespace-nowrap border font-medium transition-all";

const SIZE = {
  md: "gap-1.5 px-2.5 py-1 text-base",
  sm: "gap-1 px-2 py-0.5 text-xs",
} as const;

const ICON_SIZE = { md: "h-3.5 w-3.5", sm: "h-3 w-3" } as const;

// Literal per-tone class strings (Tailwind only generates classes it can see as
// whole strings — these can't be built dynamically).
// `tint` = soft surface (the default flag look); `solid` = filled, for an event
// that carries significance, not just a category (e.g. "Admit Today").
const TONE_TINT: Record<Tone, string> = {
  neutral: "border-neutral-200 bg-neutral-50 text-neutral-900",
  accent: "border-accent-200 bg-accent-50 text-accent-900",
  info: "border-info-200 bg-info-50 text-info-900",
  success: "border-success-200 bg-success-50 text-success-900",
  warning: "border-warning-200 bg-warning-50 text-warning-900",
  danger: "border-danger-200 bg-danger-50 text-danger-900",
};

const TONE_SOLID: Record<Tone, string> = {
  neutral: "border-neutral-600 bg-neutral-600 text-white",
  accent: "border-accent-600 bg-accent-600 text-white",
  info: "border-info-600 bg-info-600 text-white",
  success: "border-success-600 bg-success-600 text-white",
  warning: "border-warning-600 bg-warning-600 text-white",
  danger: "border-danger-600 bg-danger-600 text-white",
};

// When `interactive`, the badge deepens on hover of an ancestor `.group` (e.g. a
// table row) — the same redundant-encoding hooks the roster relies on. Only the
// tint fill has a hover treatment (solid event badges aren't row-hover flags).
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
  /** Size. `md` (default) or `sm` (the compact "flag"). */
  size?: keyof typeof SIZE;
  /** Surface treatment: `tint` (default soft flag) or `solid` (filled event). */
  fill?: "tint" | "solid";
  /** Pill (`rounded-full`) instead of the default squared corner — for
   *  admission/event badges that read as standalone pills. */
  pill?: boolean;
  /** Optional leading icon (inherits the label color via `currentColor`). */
  icon?: LucideIcon;
  /** Spin the leading icon — for in-progress states (e.g. "Saving…"). */
  iconSpin?: boolean;
  /** Deepen on ancestor `.group` hover (e.g. a table row). This is a *visual*
   *  affordance only — it does not make the Badge clickable. For a clickable
   *  chip, use Button (`variant="outline"`/`"ghost"`). Tint fill only. */
  interactive?: boolean;
  /** The label — carries the meaning even without color (redundant encoding). */
  children: ReactNode;
};

export default function Badge({
  tone = "neutral",
  size = "md",
  fill = "tint",
  pill = false,
  icon: Icon,
  iconSpin = false,
  interactive = false,
  children,
}: BadgeProps) {
  const toneClass = fill === "solid" ? TONE_SOLID[tone] : TONE_TINT[tone];
  const hover =
    interactive && fill === "tint" ? ` ${TONE_INTERACTIVE[tone]}` : "";
  const radius = pill ? "rounded-full" : "rounded";

  return (
    <span className={`${BASE} ${radius} ${SIZE[size]} ${toneClass}${hover}`}>
      {Icon && (
        <Icon
          className={`${ICON_SIZE[size]}${iconSpin ? " animate-spin" : ""}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
