import {
  AppBar,
  Button,
  Card,
  EmptyState,
  Section,
  SyncStatus,
} from "@prysm/design-system";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  LayoutGrid,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Patient } from "../../data/patients";
import { effectiveRoster, type AssignmentItem } from "../lib/assignment";
import { needsAttentionItems, rosterItems } from "../lib/triage";
import ResidentCard from "./ResidentCard";
import ResidentRow from "./ResidentRow";
import ResidentSearch from "./ResidentSearch";

type CnaAssignmentViewProps = {
  /** The confirmed assignment (pre-assigned ± requested changes). Empty when the
   *  shift started before an assignment was confirmed. */
  items: AssignmentItem[];
  /** Open a resident's patient view (assignment or search). */
  onOpenPatient: (patient: Patient) => void;
  /** Open the assignment review (shown in the pending state). */
  onReviewAssignment?: () => void;
};

// One placeholder nav destination in the global rail. Real routing is a later
// iteration; this pass only establishes the shell.
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

// The CNA Assignment View shell: left global nav rail · sticky status bar · a
// pinned, non-scrolling "Needs attention" triage cluster · the full assignment
// roster scrolling below. Pressing a resident opens their patient view (its own
// page). Membership and ordering come from lib/triage.ts (the single source of
// truth) — default sort is triage, not room.
export default function CnaAssignmentView({
  items,
  onOpenPatient,
  onReviewAssignment,
}: CnaAssignmentViewProps) {
  const roster = effectiveRoster(items);
  const needs = needsAttentionItems(roster);
  const all = rosterItems(roster);
  const pending = all.length === 0;
  const assignedIds = new Set(items.map((i) => i.patient.id));

  return (
    <div className="flex h-full">
      {/* Global nav rail — the time clock will live here in a later iteration. */}
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
        {/* Sticky status bar — shift-long status (facility · sync). */}
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
          <>
            {/* Pinned triage cluster — does NOT scroll. The first-10-minutes surface. */}
            <div className="flex-none border-b border-neutral-200 bg-neutral-50 px-6 py-5">
              <Section title="Needs attention" count={needs.length} tone="neutral">
                {needs.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                    {needs.map((item) => (
                      <ResidentCard
                        key={item.patient.id}
                        patient={item.patient}
                        onPress={() => onOpenPatient(item.patient)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={CheckCircle2}>No safety or clinical alerts right now.</EmptyState>
                )}
              </Section>
            </div>

            {/* Full assignment roster — scrolls. */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <Section title="Full assignment" count={all.length}>
                <Card padding="none" className="divide-y divide-neutral-100">
                  {all.map((item) => (
                    <ResidentRow
                      key={item.patient.id}
                      patient={item.patient}
                      onPress={() => onOpenPatient(item.patient)}
                    />
                  ))}
                </Card>
              </Section>
              <p className="mt-3 text-xs text-neutral-400">
                Sorted by triage priority — safety risks first, then active alerts, then tasks due soonest. Not room number.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
