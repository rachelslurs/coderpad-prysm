import type { ReactNode } from "react";

const VALUE = {
  md: "text-xl font-bold text-neutral-900",
  lg: "text-3xl font-extrabold text-neutral-900",
} as const;

export type FieldProps = {
  label: ReactNode;
  /** Value emphasis. "lg" for a hero value (e.g. a primary heading). */
  size?: keyof typeof VALUE;
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
