import { AppBar, Button, EmptyState, SyncStatus } from "@prysm/design-system";
import {
  Bell,
  ClipboardList,
  LayoutGrid,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Patient } from "../../data/patients";
import { effectiveRoster, type AssignmentItem } from "../lib/assignment";
import { rosterItems } from "../lib/triage";
import ResidentCard from "./ResidentCard";
import ResidentSearch from "./ResidentSearch";

type CnaAssignmentViewProps = {
  items: AssignmentItem[];
  /** Open a resident's patient view (assignment or search). */
  onOpenPatient: (patient: Patient) => void;
  /** Open the assignment review (shown in the pending state). */
  onReviewAssignment?: () => void;
};

// One placeholder nav destination. Real routing is a later iteration.
function NavButton({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      title={label}
      className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
        active ? "bg-neutral-800 text-white" : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
      }`}
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}

// The CNA Assignment View: the simplest "what do I need to know, go do the thing"
// surface. One sorted list of **uniform** cards — every resident takes the same
// space; triage is conveyed by sort order (time-sensitive → alert → room) and the
// fixed care icons, never by card size.
export default function CnaAssignmentView({
  items,
  onOpenPatient,
  onReviewAssignment,
}: CnaAssignmentViewProps) {
  const all = rosterItems(effectiveRoster(items));
  const pending = all.length === 0;
  const assignedIds = new Set(items.map((i) => i.patient.id));

  return (
    <div className="flex h-full">
      <nav className="flex w-16 flex-none flex-col items-center gap-1 bg-neutral-900 py-4">
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-accent-600 text-sm font-extrabold text-white">
          1N
        </div>
        <NavButton icon={LayoutGrid} label="Assignment" active />
        <NavButton icon={Users} label="Residents" />
        <NavButton icon={ClipboardList} label="Tasks" />
        <NavButton icon={Bell} label="Alerts" />
        <div className="mt-auto">
          <NavButton icon={Settings} label="Settings" />
        </div>
      </nav>

      <div className="relative flex flex-1 flex-col overflow-hidden">
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
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <EmptyState icon={ClipboardList}>
              Your assignment isn&rsquo;t set yet. You&rsquo;re clocked in — your supervisor may still be finalizing it.
            </EmptyState>
            {onReviewAssignment && (
              <Button className="mt-4" onClick={onReviewAssignment}>
                Review assignment
              </Button>
            )}
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
    </div>
  );
}
