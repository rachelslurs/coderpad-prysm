import { AppBar, EmptyState, SyncStatus } from "@prysm/design-system";
import { ClipboardList } from "lucide-react";
import type { Patient } from "../../data/patients";
import { effectiveRoster, type AssignmentItem } from "../lib/assignment";
import { rosterItems } from "../lib/triage";
import ResidentCard from "./ResidentCard";
import ResidentSearch from "./ResidentSearch";

type CnaAssignmentViewProps = {
  items: AssignmentItem[];
  /** Open a resident's patient view (assignment or search). */
  onOpenPatient: (patient: Patient) => void;
};

// The CNA Assignment View main column (the persistent nav rail lives in the shell
// so the menu never moves between this and the patient detail). The simplest
// "what do I need to know, go do the thing" surface: one sorted list of uniform
// cards — triage is sort order + icons, never card size.
export default function CnaAssignmentView({ items, onOpenPatient }: CnaAssignmentViewProps) {
  const all = rosterItems(effectiveRoster(items));
  const pending = all.length === 0;
  const assignedIds = new Set(items.map((i) => i.patient.id));

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <AppBar
        tone="light"
        className="flex-none border-b border-neutral-200"
        start={
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-neutral-900">1 North</span>
            <span className="hidden text-sm text-neutral-500 sm:inline">
              {pending ? "Day shift · assignment pending" : `Day shift · ${all.length} residents`}
            </span>
          </span>
        }
        end={<SyncStatus state="saved" note="just now" />}
      >
        <ResidentSearch onSelect={onOpenPatient} assignedIds={assignedIds} />
      </AppBar>

      {pending ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <EmptyState icon={ClipboardList}>No residents on your assignment.</EmptyState>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Your residents · <span className="tabular-nums">{all.length}</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Sorted by time-sensitive tasks, then alerts, then room
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {all.map((item) => (
              <ResidentCard
                key={item.patient.id}
                patient={item.patient}
                onPress={() => onOpenPatient(item.patient)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
