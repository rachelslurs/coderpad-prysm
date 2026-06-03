import type { CSSProperties } from "react";

export type SkeletonProps = {
  /** CSS width (number → px). Defaults to 100%. */
  width?: number | string;
  /** CSS height (number → px). */
  height?: number | string;
  /** Render as a circle (for avatar placeholders). */
  circle?: boolean;
  /** Border radius override (number → px). Ignored when `circle`. */
  radius?: number | string;
  className?: string;
  /** Accessible label; defaults to "Loading". */
  label?: string;
};

const dim = (v: number | string | undefined) =>
  typeof v === "number" ? `${v}px` : v;

// Shimmering placeholder for async content. The `.prysm-skeleton` shimmer lives
// in theme.css. role="status" + aria-label so loading is announced once.
export default function Skeleton({
  width = "100%",
  height,
  circle = false,
  radius,
  className = "",
  label = "Loading",
}: SkeletonProps) {
  const style: CSSProperties = {
    width: circle ? dim(height ?? width) : dim(width),
    height: dim(height),
    borderRadius: circle ? "9999px" : dim(radius) ?? "6px",
  };
  return (
    <span
      role="status"
      aria-label={label}
      className={`prysm-skeleton block ${className}`.trim()}
      style={style}
    />
  );
}
