import type { ElementType, ReactNode } from "react";

const PADDING = { none: "", sm: "p-3", md: "p-4" } as const;

export type CardProps = {
  /** Element to render as (e.g. "section", "article"). Defaults to "div". */
  as?: ElementType;
  /** Inner padding. Use "none" when children own their own padding (e.g. a
   *  divided list). Defaults to "md". */
  padding?: keyof typeof PADDING;
  className?: string;
  children: ReactNode;
};

// Generic bordered surface — the repeated "rounded-md border bg-white shadow-sm"
// container, with no domain knowledge.
export default function Card({
  as: Tag = "div",
  padding = "md",
  className = "",
  children,
}: CardProps) {
  return (
    <Tag
      className={`rounded-md border border-neutral-200 bg-white shadow-sm ${PADDING[padding]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
