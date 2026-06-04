import { Avatar, Badge, TaskProgress } from "@prysm/design-system";
import { Clock } from "lucide-react";
import type { Patient } from "../../data/patients";
import { formatRoom } from "../lib/format";
import { isStale, progressTone, updatedAgo } from "../lib/residentDisplay";
import CareIconRow from "./CareIconRow";

type ResidentCardProps = {
  patient: Patient;
  onPress?: () => void;
};

// The single, uniform resident card — every resident takes the same space. Triage
// is conveyed by sort order and the care icons, never by card size. Shows the
// CNA scan line (room · name · photo), the fixed care-icon row, task progress,
// any time-sensitive task, and a freshness stamp (labelled stale when old).
//
// Photo enlarges on hover/focus; the full name is exposed on avatar hover for
// accessibility (initials fallback when there's no photo).
export default function ResidentCard({ patient, onPress }: ResidentCardProps) {
  const stale = isStale(patient);

  return (
    <button
      type="button"
      onClick={onPress}
      className="group flex h-full w-full flex-col gap-3 border border-neutral-200 bg-white p-4 text-left transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-600"
    >
      <div className="flex items-start gap-3">
        {/* Identity (picture + room + name) zooms together on card hover/focus. */}
        <div className="flex min-w-0 flex-1 origin-top-left items-start gap-3 transition-transform duration-150 ease-out group-hover:scale-[1.1] group-focus-visible:scale-[1.1]">
          <span title={patient.name} className="flex-none">
            <Avatar name={patient.name} src={patient.photoUrl} size="md" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold tabular-nums text-neutral-500">
              Room {formatRoom(patient.room)}
            </div>
            <div className="truncate text-lg font-extrabold leading-tight text-neutral-900">
              {patient.name}
            </div>
          </div>
        </div>
        {patient.tasksTotal > 0 && (
          <TaskProgress
            value={patient.tasksDone}
            total={patient.tasksTotal}
            size={44}
            tone={progressTone(patient)}
            label={`Care tasks: ${patient.tasksDone} of ${patient.tasksTotal} done`}
          />
        )}
      </div>

      <CareIconRow patient={patient} />

      <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-xs">
        {patient.timeSensitive ? (
          <span className="inline-flex items-center gap-1 font-semibold text-neutral-700">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {patient.timeSensitive.label} · {patient.timeSensitive.due}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-neutral-400">
          {stale && (
            <Badge tone="warning" size="sm">
              Stale
            </Badge>
          )}
          Updated {updatedAgo(patient)}
        </span>
      </div>
    </button>
  );
}
