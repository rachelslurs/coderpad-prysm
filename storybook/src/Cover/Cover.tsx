import type { ElementType, ReactNode } from "react";
import { GAP, MIN_H, PAD, type MinHeight, type Space } from "../lib/scale";

// The "Cover" layout primitive (after Every Layout). A vertical flex region with
// a guaranteed minimum height that pins one "centred" child to the middle and
// lets satellite elements (a header, a footer) sit above and below it.
//
// Where Every Layout takes a `centered` CSS selector, this React port uses a
// stable marker: put `data-cover-center` on the child that should be centred.
// That keeps the targeting rule a whole, static Tailwind utility
// (`[&>[data-cover-center]]:my-auto`) instead of a runtime-built selector.
//
// Styling contract: the base is the system's Tailwind scale tokens only —
// `space` is a spacing token (gap + padding) and `minHeight` a min-height token,
// resolved through whole-literal class maps. No magic numbers. `className` is
// appended last so theme styles win.
const BASE = "flex flex-col [&>[data-cover-center]]:my-auto";

export type CoverProps = {
  /** Element to render as. Defaults to "div". */
  as?: ElementType;
  /** Minimum space between and around children, as a spacing token. Defaults to
   *  `6`. Also used as the container padding unless `noPad`. */
  space?: Space;
  /** Minimum block-size, as a min-height token. Defaults to `screen`. */
  minHeight?: MinHeight;
  /** Don't apply `space` as padding on the container. Defaults to false. */
  noPad?: boolean;
  /** Theme/consumer classes — applied last, so they win over the base. */
  className?: string;
  /** Children. Mark the one that should be vertically centred with
   *  `data-cover-center`; the rest become top/bottom satellites. */
  children: ReactNode;
};

export default function Cover({
  as: Tag = "div",
  space = 6,
  minHeight = "screen",
  noPad = false,
  className = "",
  children,
}: CoverProps) {
  const parts = [BASE, MIN_H[minHeight], GAP[space]];
  parts.push(noPad ? "p-0" : PAD[space]);
  if (className) parts.push(className);

  return <Tag className={parts.join(" ")}>{children}</Tag>;
}
