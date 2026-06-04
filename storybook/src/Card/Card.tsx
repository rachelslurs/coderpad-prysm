import type { ElementType, ReactNode } from "react";
import { Box } from "../Box";
import type { Space } from "../lib/scale";

// Map the Card's named padding sizes onto the spacing scale Box understands.
const PADDING: Record<"none" | "sm" | "md", Space> = { none: 0, sm: 3, md: 4 };

export type CardProps = {
  /** Element to render as (e.g. "section", "article"). Defaults to "div". */
  as?: ElementType;
  /** Inner padding. Use "none" when children own their own padding (e.g. a
   *  divided list). Defaults to "md". */
  padding?: keyof typeof PADDING;
  className?: string;
  children: ReactNode;
};

// Generic bordered surface — the "rounded-md border bg-white shadow-sm"
// container, with no domain knowledge. Built on the Box primitive: Box supplies
// the padding + border; Card adds the rounded, white, raised surface treatment.
export default function Card({
  as: Tag = "div",
  padding = "md",
  className = "",
  children,
}: CardProps) {
  return (
    <Box
      as={Tag}
      padding={PADDING[padding]}
      className={`rounded-md border-neutral-200 bg-white shadow-sm ${className}`.trim()}
    >
      {children}
    </Box>
  );
}
