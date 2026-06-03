import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Tone } from "../types";

type Variant = "solid" | "outline" | "ghost";

const BASE =
  "inline-flex items-center justify-center gap-1.5 rounded border font-semibold transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2";

const SIZE = {
  sm: "px-2.5 py-1.5 text-sm",
  md: "px-3 py-2 text-base",
} as const;

// Literal per-(variant, tone) class strings — Tailwind only generates whole
// strings it can see, so these can't be composed dynamically.
const VARIANT_TONE: Record<Variant, Record<Tone, string>> = {
  solid: {
    neutral:
      "border-transparent bg-neutral-600 text-white hover:bg-neutral-700 focus-visible:outline-neutral-500",
    accent:
      "border-transparent bg-accent-600 text-white hover:bg-accent-700 focus-visible:outline-accent-500",
    info: "border-transparent bg-info-600 text-white hover:bg-info-700 focus-visible:outline-info-500",
    success:
      "border-transparent bg-success-600 text-white hover:bg-success-700 focus-visible:outline-success-500",
    warning:
      "border-transparent bg-warning-600 text-white hover:bg-warning-700 focus-visible:outline-warning-500",
    danger:
      "border-transparent bg-danger-600 text-white hover:bg-danger-700 focus-visible:outline-danger-500",
  },
  outline: {
    neutral:
      "border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100 focus-visible:outline-neutral-500",
    accent:
      "border-accent-300 bg-accent-50 text-accent-800 hover:bg-accent-100 focus-visible:outline-accent-500",
    info: "border-info-300 bg-info-50 text-info-800 hover:bg-info-100 focus-visible:outline-info-500",
    success:
      "border-success-300 bg-success-50 text-success-800 hover:bg-success-100 focus-visible:outline-success-500",
    warning:
      "border-warning-300 bg-warning-50 text-warning-800 hover:bg-warning-100 focus-visible:outline-warning-500",
    danger:
      "border-danger-300 bg-danger-50 text-danger-800 hover:bg-danger-100 focus-visible:outline-danger-500",
  },
  ghost: {
    neutral:
      "border-transparent text-neutral-700 hover:bg-neutral-50 hover:text-neutral-800 focus-visible:outline-neutral-500",
    accent:
      "border-transparent text-accent-700 hover:bg-accent-50 hover:text-accent-800 focus-visible:outline-accent-500",
    info: "border-transparent text-info-700 hover:bg-info-50 hover:text-info-800 focus-visible:outline-info-500",
    success:
      "border-transparent text-success-700 hover:bg-success-50 hover:text-success-800 focus-visible:outline-success-500",
    warning:
      "border-transparent text-warning-700 hover:bg-warning-50 hover:text-warning-800 focus-visible:outline-warning-500",
    danger:
      "border-transparent text-danger-700 hover:bg-danger-50 hover:text-danger-800 focus-visible:outline-danger-500",
  },
};

export type ButtonProps = {
  variant?: Variant;
  tone?: Tone;
  size?: keyof typeof SIZE;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> & {
    // Allow data-* passthrough (test ids, analytics hooks) — React's attribute
    // types don't include these on component props.
    [dataAttr: `data-${string}`]: string | undefined;
  };

export default function Button({
  variant = "solid",
  tone = "accent",
  size = "md",
  iconLeft: IconLeft,
  iconRight: IconRight,
  type = "button",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE} ${SIZE[size]} ${VARIANT_TONE[variant][tone]} ${className}`.trim()}
      {...rest}
    >
      {IconLeft && <IconLeft aria-hidden="true" className="h-4 w-4" />}
      <span>{children}</span>
      {IconRight && <IconRight aria-hidden="true" className="h-4 w-4" />}
    </button>
  );
}
