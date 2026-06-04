// residentDisplay.tsx — shared resident presentation helpers.
//
// A resident is differentiated by their flags, not a status tier. Flags render
// as icon-only chips whose label (the flag kind, or a time-sensitive task's
// detail) lives in a hover tooltip and the accessibility tree. Plus the
// hoverable transfer-need icon. All visuals come from existing primitives
// (Badge) or plain lucide icons — no new design-system components.
import type { ReactNode } from "react";
import {
  Accessibility,
  Bandage,
  Clock,
  DoorOpen,
  HandHelping,
  TriangleAlert,
  Users,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { Badge, type Tone } from "@prysm/design-system";
import type { FlagKind, Patient } from "../../data/patients";
import { signalsFor, type TransferNeed } from "../../data/residentSignals";

// The agreed-upon transfer-need icon set. Icon-only on the scan line; the label
// is exposed to hover (title) and assistive tech (aria-label).
const TRANSFER: Record<
  Exclude<TransferNeed, "independent">,
  { icon: LucideIcon; label: string }
> = {
  "one-assist": { icon: HandHelping, label: "1-person assist" },
  "two-person": { icon: Users, label: "2-person transfer" },
  "mechanical-lift": { icon: Accessibility, label: "Mechanical lift" },
};

const FLAG_ICON: Record<FlagKind, LucideIcon> = {
  "Fall Risk": TriangleAlert,
  Aspiration: Wind,
  "Wound Care": Bandage,
  Elopement: DoorOpen,
  "Time-Sensitive": Clock,
};

/** Hoverable transfer-need glyph for the scan line. Renders nothing if independent. */
export function TransferIcon({ patient }: { patient: Patient }) {
  const { transfer } = signalsFor(patient.id);
  if (transfer === "independent") return null;
  const { icon: Icon, label } = TRANSFER[transfer];
  return (
    <span role="img" aria-label={label} title={label} className="inline-flex flex-none text-neutral-500">
      <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
    </span>
  );
}

// An icon-only badge whose label lives in a hover tooltip (`title`) and is read
// to assistive tech (`sr-only`) — icon shape carries meaning, never colour alone.
function IconChip({ icon, label, tone, size = "sm" }: { icon: LucideIcon; label: string; tone: Tone; size?: "sm" | "md" }): ReactNode {
  return (
    <span title={label} className="inline-flex">
      <Badge tone={tone} size={size} icon={icon}>
        <span className="sr-only">{label}</span>
      </Badge>
    </span>
  );
}

/**
 * A resident's flags as icon-only chips with hover detail — rendered ONLY when
 * present. For a time-sensitive task the tooltip is the task itself
 * (e.g. "Dressed by 09:00"); otherwise it's the flag name.
 */
export function ResidentChips({ patient, size = "sm" }: { patient: Patient; size?: "sm" | "md" }) {
  if (patient.flags.length === 0) return null;
  return (
    <>
      {patient.flags.map((flag, i) => (
        <IconChip
          key={`${flag.kind}-${i}`}
          icon={FLAG_ICON[flag.kind]}
          label={flag.detail ?? flag.kind}
          tone="neutral"
          size={size}
        />
      ))}
    </>
  );
}
