import type { ReactNode } from "react";
import { Button } from "react-aria-components";
import { ChevronRight } from "lucide-react";
import type { Tone } from "../types";

// Leading status accent bar — color paired with the status badge in `badges`,
// never carried alone (redundant encoding). Literal strings for Tailwind.
const ACCENT: Record<Tone, string> = {
  neutral: "bg-neutral-400",
  accent: "bg-accent-500",
  info: "bg-info-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

export type EntityCardProps = {
  /** Primary label (rendered extrabold). */
  title: ReactNode;
  /** Secondary line (supporting metadata). */
  subtitle?: ReactNode;
  /** Leading visual — typically an `<Avatar />`. */
  avatar?: ReactNode;
  /** A row of `<Badge />`s (flags, admission events). */
  badges?: ReactNode;
  /** Trailing slot — e.g. `<TaskProgress variant="ring" />` or a `<Skeleton />`. */
  trailing?: ReactNode;
  /** Leading accent-bar tone. Omit for no accent. */
  accentTone?: Tone;
  /** Makes the card a button; renders a trailing chevron. */
  onPress?: () => void;
  className?: string;
};

// The core "full card" unit: avatar + title/subtitle + optional badge row +
// trailing slot. Square-cornered (census heritage). Renders as a button when
// `onPress` is given, with full keyboard + focus support via react-aria.
export default function EntityCard({
  title,
  subtitle,
  avatar,
  badges,
  trailing,
  accentTone,
  onPress,
  className = "",
}: EntityCardProps) {
  const surface = `relative flex w-full items-center gap-3.5 overflow-hidden border border-neutral-200 bg-white p-4 text-left shadow-sm ${className}`;

  const inner = (
    <>
      {accentTone && (
        <span
          className={`absolute inset-y-0 left-0 w-1 ${ACCENT[accentTone]}`}
          aria-hidden="true"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-3.5">
          {avatar}
          <div className="min-w-0 flex-1">
            <div className="text-xl font-extrabold leading-tight text-neutral-900">
              {title}
            </div>
            {subtitle != null && (
              <div className="mt-0.5 text-sm font-medium text-neutral-600">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {badges != null && (
          <div className="flex flex-wrap gap-1.5">{badges}</div>
        )}
      </div>
      {trailing != null && <div className="flex-none">{trailing}</div>}
      {onPress && (
        <ChevronRight
          className="h-[18px] w-[18px] flex-none text-neutral-400"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (onPress) {
    return (
      <Button
        onPress={onPress}
        className={`${surface} cursor-pointer outline-none transition-colors hover:bg-neutral-50 data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-inset data-[focus-visible]:ring-accent-600/35`}
      >
        {inner}
      </Button>
    );
  }

  return <div className={surface}>{inner}</div>;
}
