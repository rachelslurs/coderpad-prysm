import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Tone } from "../types";
import { IconTile } from "../IconTile";
import { Field } from "../Field";

export type IconFieldProps = {
  icon: LucideIcon;
  label: ReactNode;
  tone?: Tone;
  /** Value emphasis, forwarded to the Field. */
  size?: "md" | "lg";
  className?: string;
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
