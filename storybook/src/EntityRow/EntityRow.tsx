import type { ReactNode } from "react";
import { Button } from "react-aria-components";
import { ChevronRight } from "lucide-react";
import type { Tone } from "../types";

// Leading status accent bar (paired with a status badge — never color alone).
const ACCENT: Record<Tone, string> = {
  neutral: "bg-neutral-400",
  accent: "bg-accent-500",
  info: "bg-info-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

export type EntityRowProps = {
  /** Primary label (rendered extrabold). */
  title: ReactNode;
  /** Secondary line (meta — truncates on overflow). */
  subtitle?: ReactNode;
  /** Leading visual — typically an `<Avatar size="md" />`. */
  avatar?: ReactNode;
  /** Optional compact badge row (keep to a few flags). */
  badges?: ReactNode;
  /** Trailing slot — e.g. a "3 / 6" count or a `<Skeleton />`. */
  trailing?: ReactNode;
  /** Leading accent-bar tone. Omit for no accent. */
  accentTone?: Tone;
  /** Makes the row a button; renders a trailing chevron. */
  onPress?: () => void;
  className?: string;
};

// The compact, roster-density sibling of EntityCard — identical data, leaner.
// Owns no bottom border: place rows in a `divide-y divide-neutral-100` list.
// Renders as a button (keyboard + focus) when `onPress` is given.
export default function EntityRow({
  title,
  subtitle,
  avatar,
  badges,
  trailing,
  accentTone,
  onPress,
  className = "",
}: EntityRowProps) {
  const surface = `relative flex w-full items-center gap-3 px-4 py-3 text-left ${className}`;

  const inner = (
    <>
      {accentTone && (
        <span
          className={`absolute inset-y-0 left-0 w-1 ${ACCENT[accentTone]}`}
          aria-hidden="true"
        />
      )}
      {avatar}
      <div className="min-w-0 flex-1">
        <div className="text-[17px] font-extrabold leading-tight text-neutral-900">
          {title}
        </div>
        {subtitle != null && (
          <div className="mt-px truncate text-[13px] text-neutral-600">
            {subtitle}
          </div>
        )}
        {badges != null && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">{badges}</div>
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
        className={`${surface} cursor-pointer outline-none transition-colors hover:bg-accent-50 data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-inset data-[focus-visible]:ring-accent-600/35`}
      >
        {inner}
      </Button>
    );
  }

  return <div className={surface}>{inner}</div>;
}
