import { EmptyState } from "@prysm/design-system";
import { ClipboardList } from "lucide-react";
import type { Patient } from "../../data/patients";
import { effectiveRoster, type AssignmentItem } from "../lib/assignment";
import { rosterItems } from "../lib/triage";
import ResidentCard from "./ResidentCard";

type CnaAssignmentViewProps = {
  items: AssignmentItem[];
  /** Open a resident's patient view (assignment or search). */
  onOpenPatient: (patient: Patient) => void;
};

// The CNA Assignment View content (the nav rail + app bar live in the shell so
// the chrome never moves). The simplest "what do I need to know, go do the thing"
// surface: one sorted list of uniform cards — triage is sort order + icons.
export default function CnaAssignmentView({ items, onOpenPatient }: CnaAssignmentViewProps) {
  const all = rosterItems(effectiveRoster(items));

  if (all.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptyState icon={ClipboardList}>No residents on your assignment.</EmptyState>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
          Your residents · <span className="tabular-nums">{all.length}</span>
        </h2>
        <p className="text-xs text-neutral-400">Sorted by time-sensitive tasks, then alerts, then room</p>
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
  );
}
