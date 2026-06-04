import type { ElementType, ReactNode } from "react";
import { GAP, type Space } from "../lib/scale";

// The "Sidebar" layout primitive (after Every Layout). Two adjacent elements
// where one (the sidebar) has a fixed width and the other (the content) takes
// the rest. When the content would drop below `contentMin`, the two wrap into a
// single column — no media query.
//
// Pass exactly two children, in source order. `side` says which is the sidebar.
//
// Styling contract: the base is the system's Tailwind scale tokens only.
// `space` is a spacing token; `sideWidth` is a flex-basis (rail-width) token;
// `contentMin` is a ratio token. Each resolves through a whole-literal class map
// (including the child-targeting rules) — no magic numbers — and `className`
// (appended last) wins.

/** Fixed rail width for the sidebar — Tailwind flex-basis (rem) steps. */
export type SideWidth = 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 96;

/** The content column's minimum width before the two wrap, as a ratio. */
export type ContentMin = "1/2" | "3/5" | "2/3" | "3/4" | "full";

const BASE = "flex flex-wrap [&>*]:grow";

// Rail width applied to both children (the content child overrides it below).
const SIDE_WIDTH: Record<SideWidth, string> = {
  16: "[&>*]:basis-16", 20: "[&>*]:basis-20", 24: "[&>*]:basis-24",
  32: "[&>*]:basis-32", 40: "[&>*]:basis-40", 48: "[&>*]:basis-48",
  56: "[&>*]:basis-56", 64: "[&>*]:basis-64", 72: "[&>*]:basis-72",
  80: "[&>*]:basis-80", 96: "[&>*]:basis-96",
};

// The content child grows to fill, collapsing when it hits its min width. It's
// the *last* child when the sidebar is on the left, the *first* when on the
// right — written as whole literals so Tailwind can see them.
const CONTENT_GROW = {
  left: "[&>:last-child]:basis-0 [&>:last-child]:grow-[999]",
  right: "[&>:first-child]:basis-0 [&>:first-child]:grow-[999]",
} as const;

const CONTENT_MIN: Record<"left" | "right", Record<ContentMin, string>> = {
  left: {
    "1/2": "[&>:last-child]:min-w-[50%]", "3/5": "[&>:last-child]:min-w-[60%]",
    "2/3": "[&>:last-child]:min-w-[66.667%]", "3/4": "[&>:last-child]:min-w-[75%]",
    full: "[&>:last-child]:min-w-full",
  },
  right: {
    "1/2": "[&>:first-child]:min-w-[50%]", "3/5": "[&>:first-child]:min-w-[60%]",
    "2/3": "[&>:first-child]:min-w-[66.667%]", "3/4": "[&>:first-child]:min-w-[75%]",
    full: "[&>:first-child]:min-w-full",
  },
};

export type SidebarProps = {
  /** Element to render as. Defaults to "div". */
  as?: ElementType;
  /** Which child is the fixed-width sidebar. Defaults to "left". */
  side?: "left" | "right";
  /** Sidebar rail width, as a flex-basis token. If omitted, the sidebar takes
   *  its natural content width. */
  sideWidth?: SideWidth;
  /** The content column's minimum width before the two wrap, as a ratio token.
   *  Defaults to `1/2`. */
  contentMin?: ContentMin;
  /** Gap between the two elements, as a spacing token. Defaults to `6`. */
  space?: Space;
  /** Let the two adopt their natural height instead of stretching to match.
   *  Defaults to false. */
  noStretch?: boolean;
  /** Theme/consumer classes — applied last, so they win over the base. */
  className?: string;
  /** Exactly two children: the sidebar and the content, in source order. */
  children: ReactNode;
};

export default function Sidebar({
  as: Tag = "div",
  side = "left",
  sideWidth,
  contentMin = "1/2",
  space = 6,
  noStretch = false,
  className = "",
  children,
}: SidebarProps) {
  const parts = [BASE, GAP[space], CONTENT_GROW[side], CONTENT_MIN[side][contentMin]];
  if (sideWidth != null) parts.push(SIDE_WIDTH[sideWidth]);
  if (noStretch) parts.push("items-start");
  if (className) parts.push(className);

  return <Tag className={parts.join(" ")}>{children}</Tag>;
}
