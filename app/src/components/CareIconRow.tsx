// CareIconRow.tsx — the agreed, memorizable care-icon set in fixed positions.
//
// Three fixed slots a CNA learns once and reads at a glance:
//   1. High-risk (fall / elopement)   2. Transfer assistance   3. Continence
// Icon-only to save space; hover/tap reveals the detail (title + sr-only label),
// never colour alone. ADL/care info the CNA acts on — not clinical data.
import {
  Accessibility,
  CircleCheck,
  Droplets,
  HandHelping,
  PersonStanding,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Continence, Patient, TransferNeed } from "../../data/patients";

const TRANSFER: Record<TransferNeed, { icon: LucideIcon; label: string }> = {
  independent: { icon: PersonStanding, label: "Independent transfer" },
  "one-assist": { icon: HandHelping, label: "One-person assist" },
  "two-person": { icon: Users, label: "Two-person transfer" },
  "mechanical-lift": { icon: Accessibility, label: "Mechanical lift — needs 2 people" },
};

const CONTINENCE: Record<Continence, { icon: LucideIcon; label: string }> = {
  continent: { icon: CircleCheck, label: "Continent" },
  incontinent: { icon: Droplets, label: "Incontinent — needs changing" },
};

function Slot({
  icon: Icon,
  label,
  muted = false,
  badge,
}: {
  icon: LucideIcon | null;
  label?: string;
  muted?: boolean;
  /** Small number badge on the icon (e.g. people required for a transfer). */
  badge?: number;
}) {
  // Fixed-width slot keeps the three positions aligned even when a slot is empty.
  if (!Icon) return <span aria-hidden="true" className="h-6 w-6 flex-none" />;
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`relative inline-flex h-6 w-6 flex-none items-center justify-center rounded ${
        muted ? "text-neutral-400" : "text-neutral-600"
      }`}
    >
      <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
      {badge != null && (
        <span className="absolute -bottom-1 -right-1 grid h-3.5 min-w-[14px] place-items-center rounded-full bg-neutral-700 px-[3px] text-[9px] font-bold leading-none text-white">
          {badge}
        </span>
      )}
    </span>
  );
}

const riskLabel = (p: Patient): string =>
  [p.fallRisk && "High fall risk", p.wanderer && "Elopement risk"].filter(Boolean).join(" · ");

export default function CareIconRow({ patient }: { patient: Patient }) {
  const highRisk = patient.fallRisk || patient.wanderer;
  const transfer = TRANSFER[patient.transfer];
  const continence = CONTINENCE[patient.continence];

  return (
    <div className="flex items-center gap-1.5">
      {/* 1 — high-risk (empty slot when none) */}
      <Slot icon={highRisk ? TriangleAlert : null} label={highRisk ? riskLabel(patient) : undefined} />
      {/* 2 — transfer */}
      <Slot icon={transfer.icon} label={transfer.label} muted={patient.transfer === "independent"} />
      {/* 3 — continence */}
      <Slot
        icon={continence.icon}
        label={continence.label}
        muted={patient.continence === "continent"}
      />
    </div>
  );
}
