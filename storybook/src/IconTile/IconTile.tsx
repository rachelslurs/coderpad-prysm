import type { LucideIcon } from "lucide-react";
import type { Tone } from "../types";

const TONE: Record<Tone, string> = {
  neutral: "bg-neutral-50 text-neutral-600",
  accent: "bg-accent-50 text-accent-600",
  info: "bg-info-50 text-info-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

const PAD = { sm: "p-1.5", md: "p-2" } as const;
const ICON = { sm: "h-3.5 w-3.5", md: "h-4 w-4" } as const;

export type IconTileProps = {
  /** The glyph (decorative — rendered `aria-hidden`; pair with a visible label,
   *  as IconField does, when it carries meaning). */
  icon: LucideIcon;
  /** Semantic tint: a `*-50` background behind a `*-600` glyph. Defaults to
   *  `accent`. */
  tone?: Tone;
  /** Tile size. `md` (default) or `sm` for dense rows. */
  size?: keyof typeof PAD;
};

// Tinted square holding a single icon — the "icon chip" used in list rows,
// detail fields, headers, etc.
export default function IconTile({
  icon: Icon,
  tone = "accent",
  size = "md",
}: IconTileProps) {
  return (
    <div className={`inline-flex rounded ${PAD[size]} ${TONE[tone]}`}>
      <Icon aria-hidden="true" className={ICON[size]} />
    </div>
  );
}
