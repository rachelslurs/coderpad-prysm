import type { ReactNode } from "react";

const TONE = {
  dark: "bg-neutral-900 text-white",
  light: "border-b border-neutral-200 bg-white text-neutral-900",
} as const;

export type AppBarProps = {
  /** Leading slot — brand, title, or back button. */
  start?: ReactNode;
  /** Center slot — e.g. nav (optional). */
  children?: ReactNode;
  /** Trailing slot — actions; pushed to the right. */
  end?: ReactNode;
  /** `dark` (default, the command bar) or `light` (a plain app header). */
  tone?: keyof typeof TONE;
  className?: string;
};

// A minimal top-bar shell: a fixed-height flex bar with start / center / end
// slots. Deliberately unopinionated — tabs, menus, sync chips, and badges are
// composed by the consumer into the slots, so it fits simple and rich uses alike.
export default function AppBar({
  start,
  children,
  end,
  tone = "dark",
  className = "",
}: AppBarProps) {
  return (
    <header
      className={`flex h-14 items-center gap-4 px-4 ${TONE[tone]} ${className}`.trim()}
    >
      {start}
      {children}
      {end != null && <div className="ml-auto flex items-center gap-2">{end}</div>}
    </header>
  );
}
