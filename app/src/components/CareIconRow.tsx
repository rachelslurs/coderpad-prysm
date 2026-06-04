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
  PersonStanding,
  TriangleAlert,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Continence, Patient, TransferNeed } from "../../data/patients";

// `people` drives the count badge (paralleling two-person's "2"); omitted for
// independent transfers (no badge).
const TRANSFER: Record<TransferNeed, { icon: LucideIcon; label: string; people?: number }> = {
  independent: { icon: PersonStanding, label: "Independent transfer" },
  "one-assist": { icon: User, label: "One-person assist", people: 1 },
  "two-person": { icon: Users, label: "Two-person transfer", people: 2 },
  "mechanical-lift": { icon: Accessibility, label: "Mechanical lift — needs 2 people", people: 2 },
};

const CONTINENCE: Record<Continence, { icon: LucideIcon; label: string }> = {
  continent: { icon: CircleCheck, label: "Continent" },
  incontinent: { icon: Droplets, label: "Incontinent — needs changing" },
};

const SIZE = {
  md: { gap: "gap-1.5", slot: "h-6 w-6", icon: "h-[18px] w-[18px]", badge: "h-3.5 min-w-[14px] px-[3px] text-[9px]" },
  lg: { gap: "gap-2.5", slot: "h-8 w-8", icon: "h-6 w-6", badge: "h-4 min-w-4 px-1 text-[10px]" },
} as const;

type Size = keyof typeof SIZE;

function Slot({
  icon: Icon,
  label,
  muted = false,
  badge,
  size,
}: {
  icon: LucideIcon | null;
  label?: string;
  muted?: boolean;
  badge?: number;
  size: Size;
}) {
  const s = SIZE[size];
  // Fixed-width slot keeps the three positions aligned even when a slot is empty.
  if (!Icon) return <span aria-hidden="true" className={`flex-none ${s.slot}`} />;
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`relative inline-flex flex-none items-center justify-center rounded ${s.slot} ${
        muted ? "text-neutral-400" : "text-neutral-600"
      }`}
    >
      <Icon aria-hidden="true" className={s.icon} />
      {badge != null && (
        <span
          className={`absolute -bottom-1 -right-1 grid place-items-center rounded-full bg-neutral-700 font-bold leading-none text-white ${s.badge}`}
        >
          {badge}
        </span>
      )}
    </span>
  );
}

const riskLabel = (p: Patient): string =>
  [p.fallRisk && "High fall risk", p.wanderer && "Elopement risk"].filter(Boolean).join(" · ");

export default function CareIconRow({ patient, size = "md" }: { patient: Patient; size?: Size }) {
  const highRisk = patient.fallRisk || patient.wanderer;
  const transfer = TRANSFER[patient.transfer];
  const continence = CONTINENCE[patient.continence];

  return (
    <div className={`flex items-center ${SIZE[size].gap}`}>
      {/* 1 — high-risk (empty slot when none) */}
      <Slot icon={highRisk ? TriangleAlert : null} label={highRisk ? riskLabel(patient) : undefined} size={size} />
      {/* 2 — transfer */}
      <Slot icon={transfer.icon} label={transfer.label} muted={patient.transfer === "independent"} badge={transfer.people} size={size} />
      {/* 3 — continence */}
      <Slot icon={continence.icon} label={continence.label} muted={patient.continence === "continent"} size={size} />
    </div>
  );
}
