import type { Patient } from "../../data/patients";
import { AlertOctagon, AlertTriangle, CheckCircle, type LucideIcon } from "lucide-react";

// Three-tier triage encoding. Each variant exposes `group-hover:*` hooks so a
// parent `group` (the table row) can deepen the badge on row hover — wired up
// in the roster commit. Redundant encoding (color + icon + text label) passes
// WCAG "don't rely on color alone."
const BASE =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded border px-2.5 py-1 text-sm font-medium transition-all";

const STATUS_VARIANT: Record<Patient["status"], string> = {
  Critical:
    "border-rose-200 bg-rose-50 text-rose-700 " +
    "group-hover:border-rose-400 group-hover:bg-rose-100 group-hover:ring-1 group-hover:ring-rose-400",
  "Needs Attention":
    "border-amber-300 bg-amber-50 text-amber-900 " +
    "group-hover:border-amber-400 group-hover:bg-amber-100 group-hover:ring-1 group-hover:ring-amber-400",
  Stable:
    "border-slate-300 bg-slate-50 text-slate-700 " +
    "group-hover:border-slate-400 group-hover:bg-slate-100 group-hover:ring-1 group-hover:ring-slate-400",
};

const STATUS_ICON: Record<Patient["status"], LucideIcon> = {
  Critical: AlertOctagon,
  "Needs Attention": AlertTriangle,
  Stable: CheckCircle,
};

const ICON_TINT: Record<Patient["status"], string> = {
  Critical: "text-rose-600",
  "Needs Attention": "text-amber-600",
  Stable: "text-slate-500",
};

type StatusBadgeProps = {
  status: Patient["status"];
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const Icon = STATUS_ICON[status];
  return (
    <div className={`${BASE} ${STATUS_VARIANT[status]}`}>
      <Icon className={`h-3.5 w-3.5 ${ICON_TINT[status]}`} aria-hidden="true" />
      <span>{status}</span>
    </div>
  );
}
