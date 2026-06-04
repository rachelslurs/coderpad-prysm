import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Tone } from "../types";
import { IconTile } from "../IconTile";
import { Field } from "../Field";

export type IconFieldProps = {
  /** Leading icon, rendered inside the IconTile. */
  icon: LucideIcon;
  /** Small muted label (forwarded to the inner Field). */
  label: ReactNode;
  /** Semantic tone for the IconTile tint. Defaults to `accent`. */
  tone?: Tone;
  /** Value emphasis, forwarded to the Field. `md` (default) or `lg`. */
  size?: "md" | "lg";
  className?: string;
  /** The value (forwarded to the inner Field). */
  children: ReactNode;
};

// Icon chip + label/value row — the recurring "icon · label · value" line.
export default function IconField({
  icon,
  label,
  tone = "accent",
  size = "md",
  className = "",
  children,
}: IconFieldProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <IconTile icon={icon} tone={tone} />
      <Field label={label} size={size}>
        {children}
      </Field>
    </div>
  );
}
