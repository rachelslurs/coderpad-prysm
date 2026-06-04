import type { ElementType, ReactNode } from "react";
import { MAX_W, PAD_X, type Measure, type Space } from "../lib/scale";

// The "Center" layout primitive (after Every Layout). Horizontally centres a
// block and clamps its width to a typographic measure — the reason long-form
// prose stays readable on any screen.
//
// Styling contract: the base is the system's Tailwind scale tokens only — `max`
// is a measure token (default `prose`, ~65ch) and `gutters` a spacing token,
// both resolved through whole-literal class maps. No magic numbers. The
// consumer `className` is appended last and wins.
const BASE = "mx-auto box-content";

export type CenterProps = {
  /** Element to render as. Defaults to "div". */
  as?: ElementType;
  /** Typographic measure, as a max-width token. Defaults to `prose` (~65ch). */
  max?: Measure;
  /** Also centre the text (`text-align: center`). Defaults to false. */
  andText?: boolean;
  /** Minimum inline padding on either side of the content, as a spacing token. */
  gutters?: Space;
  /** Centre child elements on their own content width too (flex column,
   *  `align-items: center`). Defaults to false. */
  intrinsic?: boolean;
  /** Theme/consumer classes — applied last, so they win over the base. */
  className?: string;
  children: ReactNode;
};

export default function Center({
  as: Tag = "div",
  max = "prose",
  andText = false,
  gutters,
  intrinsic = false,
  className = "",
  children,
}: CenterProps) {
  const parts = [BASE, MAX_W[max]];
  if (gutters != null) parts.push(PAD_X[gutters]);
  if (andText) parts.push("text-center");
  if (intrinsic) parts.push("flex flex-col items-center");
  if (className) parts.push(className);

  return <Tag className={parts.join(" ")}>{children}</Tag>;
}
