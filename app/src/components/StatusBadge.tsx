import { Badge, type Tone } from "@prysm/design-system";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import type { Patient } from "../../data/patients";

type PatientStatus = Patient["status"];

// Domain mapping: triage status → a generic tone + icon. This is all the
// patient-specific knowledge that's left — the visuals come from <Badge/>.
const STATUS_TONE: Record<PatientStatus, Tone> = {
  Critical: "danger",
  "Needs Attention": "warning",
  Stable: "neutral",
};

const STATUS_ICON: Record<PatientStatus, LucideIcon> = {
  Critical: AlertOctagon,
  "Needs Attention": AlertTriangle,
  Stable: CheckCircle,
};

type StatusBadgeProps = {
  status: PatientStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge tone={STATUS_TONE[status]} icon={STATUS_ICON[status]} interactive>
      {status}
    </Badge>
  );
}
