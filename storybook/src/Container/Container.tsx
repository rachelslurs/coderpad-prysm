import type { CSSProperties, ElementType, ReactNode } from "react";

// The "Container" layout primitive (after Every Layout). Declares a containment
// context so descendants can respond to *this element's* width with `@container`
// queries, instead of the viewport's. The escape hatch when a component lives in
// too many slots to use breakpoints.
//
// Styling contract: the base is a single Tailwind utility
// (`[container-type:inline-size]`). The optional `name` is a containment
// *identifier* the consumer references in `@container <name> (…)` — a name, not
// a magic number — so it's set via `container-name`. `className` is appended
// last so theme styles win.
const BASE = "block [container-type:inline-size]";

export type ContainerProps = {
  /** Element to render as. Defaults to "div". */
  as?: ElementType;
  /** Containment name, referenced by `@container <name> (…)` queries. Optional —
   *  omit for an anonymous containment context. */
  name?: string;
  /** Theme/consumer classes — applied last, so they win over the base. */
  className?: string;
  children: ReactNode;
};

export default function Container({
  as: Tag = "div",
  name,
  className = "",
  children,
}: ContainerProps) {
  const style = name ? ({ containerName: name } as CSSProperties) : undefined;

  return (
    <Tag style={style} className={`${BASE} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
