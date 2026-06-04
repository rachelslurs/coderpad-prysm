import type { ReactNode } from "react";

const VALUE = {
  md: "text-xl font-bold text-neutral-900",
  lg: "text-3xl font-extrabold text-neutral-900",
} as const;

export type FieldProps = {
  /** Small muted label shown above the value (e.g. "Attending Physician"). */
  label: ReactNode;
  /** Value emphasis. `md` (default) or `lg` for a hero value (a primary
   *  heading-scale value, e.g. the lead diagnosis). */
  size?: keyof typeof VALUE;
  /** The value — bold, rendered beneath the label. */
  children: ReactNode;
};

// Label-over-value pair — the smallest unit of a detail/spec display.
export default function Field({ label, size = "md", children }: FieldProps) {
  return (
    <div>
      <div className="text-sm font-semibold text-neutral-500">{label}</div>
      <div className={VALUE[size]}>{children}</div>
    </div>
  );
}
