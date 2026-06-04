import type { ReactNode } from "react";

export type FormFieldProps = {
  /** Field label (uppercase eyebrow). */
  label: ReactNode;
  /** Right-aligned reference slot (e.g. a "Last 72" prior reading). */
  hint?: ReactNode;
  /** Associates the label with a control by id (optional). */
  htmlFor?: string;
  /** The control — Stepper / Segmented / Toggle / Select, etc. */
  children: ReactNode;
  className?: string;
};

// A structured-input wrapper: an uppercase label, an optional right-aligned
// reference (the "Last <value>" prior reading), and a control below. Owns its
// padding but no divider — stack these in a `divide-y divide-neutral-100` list.
export default function FormField({
  label,
  hint,
  htmlFor,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`p-4 ${className}`.trim()}>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="text-xs font-extrabold uppercase tracking-wider text-neutral-500"
        >
          {label}
        </label>
        {hint != null && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
