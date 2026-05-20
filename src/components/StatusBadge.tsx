import type { Patient } from "../../data/patients";

// Base pill + decorative dot via ::before (no extra DOM, implicitly hidden
// from the a11y tree — text still carries the meaning for SRs).
const BASE =
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full " +
  "before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full";

// Closed enum off Patient["status"] — adding a new status becomes a type
// error at the lookup, not a silent style miss in the JSX.
// Light bg + dark text + inset ring passes WCAG 4.5:1 without the harshness
// of saturated bright pills (which often fail contrast).
const STATUS_VARIANT: Record<Patient["status"], string> = {
  "Stable":
    "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 before:bg-green-500",
  "Needs Attention":
    "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20 before:bg-amber-500",
  "Critical":
    "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 before:bg-red-500",
};

type StatusBadgeProps = {
  status: Patient["status"];
};

// THINKING: Going with a leading dot (::before, no extra DOM) over an icon —
// same shape-redundancy win for color-blind users without adding a
// lucide/svg dep. Text + dot + color = three independent cues for urgency,
// which matters in a clinical context where rows get scanned fast.
export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`${BASE} ${STATUS_VARIANT[status]}`}>{status}</span>;
}
