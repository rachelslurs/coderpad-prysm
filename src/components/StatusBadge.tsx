import type { Patient } from "../../data/patients";

// Base pill + decorative dot via ::before (no extra DOM, implicitly hidden
// from the a11y tree — text still carries the meaning for SRs).
const BASE =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs " +
  "before:content-[''] before:inline-block before:rounded-full";

// THINKING: For at-a-glance triage, asymmetric prominence > equal-weight
// badges. Critical pops (solid red + uppercase + larger pulsing dot),
// Stable recedes (low-chroma gray) so deviations are what catch the eye.
// Height stays constant across all three so table rows don't jitter.
// Cues stacked per status:
//   Stable          → color + small dot
//   Needs Attention → color + dot + ring + weight
//   Critical        → color + larger dot + weight + casing + tracking + motion
// Multiple cues = passes WCAG "don't rely on color alone" cleanly.
const STATUS_VARIANT: Record<Patient["status"], string> = {
  // Quiet — gray on gray. Recedes by design.
  "Stable":
    "font-medium bg-zinc-100 text-zinc-600 " +
    "before:w-1.5 before:h-1.5 before:bg-zinc-400",

  // Medium — amber on amber, ring for definition, semibold for weight.
  "Needs Attention":
    "font-semibold bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-600/30 " +
    "before:w-1.5 before:h-1.5 before:bg-amber-600",

  // Loud — solid red, white text, uppercase + tracking, larger dot with a
  // motion-safe pulse. White on red-600 ≈ 4.83:1 (passes WCAG AA).
  "Critical":
    "font-bold uppercase tracking-wide bg-red-600 text-white shadow-sm " +
    "before:w-2 before:h-2 before:bg-white motion-safe:before:animate-pulse",
};

type StatusBadgeProps = {
  status: Patient["status"];
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`${BASE} ${STATUS_VARIANT[status]}`}>{status}</span>;
}
