import type { ElementType, ReactNode } from "react";
import { BORDER, PAD, type BorderWidth, type Space } from "../lib/scale";

// The "Box" layout primitive (after Every Layout). The simplest unit of
// containment: padding + a border, nothing else. Every card, callout, banner
// and tile begins here.
//
// Styling contract (see the design system's Tailwind/theme conventions):
// - The base is built from the system's own Tailwind scale tokens — `padding`
//   and `borderWidth` are scale keys resolved through whole-literal class maps
//   (like Badge's tone maps), never raw CSS lengths. No magic numbers, and
//   spacing stays consistent with the rest of the system.
// - Color is intentionally left to Tailwind's preflight defaults — a solid
//   `currentColor` border and no background. So any theme class a consumer
//   passes (`bg-accent-50`, `border-danger-300`, a tone map, …) simply wins,
//   with no specificity fight.
// - `className` is appended last so consumer/theme styles take precedence.

export type BoxProps = {
  /** Element or component to render as (e.g. "section", "article", or a
   *  react-aria `Button`). Defaults to "div". */
  as?: ElementType;
  /** Padding, as a spacing-scale token. Defaults to `6`. */
  padding?: Space;
  /** Border width, as a border-scale token. Defaults to `1` (1px). The border is
   *  a solid `currentColor` line unless a theme class recolors it. */
  borderWidth?: BorderWidth;
  /** Invert the box for a quick greyscale dark treatment (`filter: invert()` on
   *  a white surface). Only recommended for greyscale designs. */
  invert?: boolean;
  /** Theme/consumer classes — applied last, so they win over the base. */
  className?: string;
  children: ReactNode;
  /** Any other props are forwarded to the rendered element — so Box can drive
   *  interactive elements too (e.g. `onPress` on a Button, `aria-*`, `data-*`).
   *  This is how higher-level surfaces (Card, EntityCard) compose Box. */
  [prop: string]: unknown;
};

export default function Box({
  as: Tag = "div",
  padding = 6,
  borderWidth = 1,
  invert = false,
  className = "",
  children,
  ...rest
}: BoxProps) {
  const parts = [PAD[padding], BORDER[borderWidth]];
  if (invert) parts.push("invert", "bg-white");
  if (className) parts.push(className);

  return (
    <Tag className={parts.join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
