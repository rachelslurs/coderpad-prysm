import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle,
  CloudOff,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "../Badge";
import type { Tone } from "../types";

export type SyncState = "saved" | "saving" | "queued" | "failed";

// Each sync state maps to one redundant-encoding triple: tone (color) + icon +
// label. "saving" spins its icon. Built on Badge so the pill visuals stay in one
// place — this component only owns the state→meaning mapping.
const META: Record<
  SyncState,
  { tone: Tone; icon: LucideIcon; label: string; spin?: boolean }
> = {
  saved: { tone: "success", icon: CheckCircle, label: "Saved" },
  saving: { tone: "info", icon: RefreshCw, label: "Saving…", spin: true },
  queued: { tone: "warning", icon: CloudOff, label: "Queued" },
  failed: { tone: "danger", icon: AlertTriangle, label: "Retry needed" },
};

export type SyncStatusProps = {
  /** Sync state. Drives color, icon, and label together. */
  state?: SyncState;
  /** Optional trailing context (e.g. a timestamp or "offline"). */
  note?: ReactNode;
};

// A per-entry sync indicator: connectivity confidence, made reusable.
export default function SyncStatus({ state = "saved", note }: SyncStatusProps) {
  const { tone, icon, label, spin } = META[state];
  return (
    <Badge tone={tone} icon={icon} iconSpin={spin} pill size="sm">
      {label}
      {note != null && <span className="font-medium opacity-80"> · {note}</span>}
    </Badge>
  );
}
