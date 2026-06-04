import type { ReactNode } from "react";
import type { Tone } from "../types";

// Leading dot + count-pill tints, keyed to tone (literal strings for Tailwind).
const DOT: Record<Tone, string> = {
  neutral: "bg-neutral-400",
  accent: "bg-accent-500",
  info: "bg-info-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

const COUNT: Record<Tone, string> = {
  neutral: "bg-neutral-100 text-neutral-600",
  accent: "bg-accent-50 text-accent-700",
  info: "bg-info-50 text-info-700",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
};

export type SectionProps = {
  /** Optional group heading (small uppercase label). Omit for an untitled group. */
  title?: ReactNode;
  /** Optional count shown as a pill after the title (e.g. "Needs attention · 3"). */
  count?: ReactNode;
  /** Tone for the leading dot + count pill. Defaults to `neutral`. */
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

// A labelled group of content — heading + body. The "tier" pattern, generalized.
// With a `count` (and/or `tone`) the heading becomes a section header: a leading
// dot, the label, a count pill, and a trailing hairline rule.
export default function Section({
  title,
  count,
  tone = "neutral",
  className = "",
  children,
}: SectionProps) {
  const isHeader = count != null || title != null;
  // A dot + rule make sense only once there's a count to anchor them.
  const decorated = count != null;

  return (
    <section className={className}>
      {isHeader && (
        <div className="mb-3 flex items-center gap-2">
          {decorated && (
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${DOT[tone]}`}
              aria-hidden="true"
            />
          )}
          {title != null && (
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
              {title}
            </h3>
          )}
          {count != null && (
            <span
              className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums ${COUNT[tone]}`}
            >
              {count}
            </span>
          )}
          {decorated && (
            <span className="ml-1 h-px flex-1 bg-neutral-200" aria-hidden="true" />
          )}
        </div>
      )}
      {children}
    </section>
  );
}
