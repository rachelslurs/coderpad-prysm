import type { LucideIcon } from "lucide-react";
import { MARGIN_E, type Space } from "../lib/scale";

// The "Icon" layout primitive (after Every Layout). Inline-sizes an icon to the
// surrounding text's cap height, so a glyph always matches its line — at any
// font size — with optional spacing before the following text and an accessible
// label.
//
// The glyph comes from the design system's icon set (lucide-react), the same
// `LucideIcon` type Badge and IconTile take — not arbitrary SVG.
//
// Styling contract: the base is the system's Tailwind tokens only. The svg is
// sized with a static `h-[1cap]` rule (cap height, semantic — not a magic
// number); `space` is a spacing token resolved through a whole-literal class
// map. The glyph inherits color via `currentColor`, and `className` (appended
// last) wins, so a text-color class tints it.
//
// Accessibility: pass `label` to expose the icon as a named image; otherwise
// it's decorative (`aria-hidden`). Pair meaningful icons with visible text —
// never rely on the glyph alone (redundant encoding).
const WRAP = "inline-flex items-baseline";

export type IconProps = {
  /** The glyph, from the design system's icon set (lucide-react). */
  icon: LucideIcon;
  /** Space between the icon and the following text, as a spacing token. If
   *  omitted, natural word spacing is preserved. */
  space?: Space;
  /** Accessible name. When set, the icon is exposed as an image with this label;
   *  otherwise it's decorative and hidden from assistive tech. */
  label?: string;
  /** Theme/consumer classes — applied last, so they win over the base. */
  className?: string;
};

export default function Icon({ icon: Glyph, space, label, className = "" }: IconProps) {
  const parts = [WRAP];
  if (space != null) parts.push(MARGIN_E[space]);
  if (className) parts.push(className);

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={parts.join(" ")}
    >
      <Glyph className="h-[1cap] w-[1cap]" aria-hidden="true" />
    </span>
  );
}
