import { useState } from "react";
import { AppBar, SyncStatus } from "@prysm/design-system";
import { PATIENTS, type Patient } from "../data/patients.ts";
import AssignmentSelection from "./components/AssignmentSelection.tsx";
import CnaAssignmentView from "./components/CnaAssignmentView.tsx";
import ClockIn from "./components/ClockIn.tsx";
import NavRail from "./components/NavRail.tsx";
import PatientView from "./components/PatientView.tsx";
import ResidentSearch from "./components/ResidentSearch.tsx";
import { effectiveRoster, type AssignmentItem } from "./lib/assignment.ts";
import { ShiftProvider } from "./state/shift.tsx";
import { useShift } from "./state/shiftContext.ts";

// The CNA's shift flow: clock in → confirm the assignment → work the assignment
// view ↔ open a resident's patient view. Clock-in gates everything (pay starts at
// clock-in), and a confirmed assignment is required before the view opens.
const byRoom = (a: Patient, b: Patient) =>
  a.room.localeCompare(b.room, undefined, { numeric: true });

function ShiftFlow() {
  const { clockedInAt } = useShift();
  const [assignment, setAssignment] = useState<AssignmentItem[] | null>(null);
  const [selectedId, setSelectedId] = useState<Patient["id"] | null>(null);

  if (!clockedInAt) return <ClockIn />;
  if (!assignment) return <AssignmentSelection onConfirm={setAssignment} />;

  const roster = effectiveRoster(assignment)
    .map((i) => i.patient)
    .sort(byRoom);
  const selected = selectedId != null ? PATIENTS.find((p) => p.id === selectedId) : undefined;
  const assignedIds = new Set(assignment.map((i) => i.patient.id));

  // In-shift shell: the nav rail AND the app bar (with search) are persistent so
  // the chrome never moves between the assignment view and the patient detail.
  // Pressing "/" returns to the assignment view and focuses search.
  return (
    <div className="flex h-full">
      <NavRail />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppBar
          tone="light"
          className="flex-none border-b border-neutral-200"
          start={
            <span className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-neutral-900">1 North</span>
              <span className="hidden text-sm text-neutral-500 sm:inline">
                Day shift · {roster.length} residents
              </span>
            </span>
          }
          end={<SyncStatus state="saved" note="just now" />}
        >
          <ResidentSearch
            onSelect={(p) => setSelectedId(p.id)}
            assignedIds={assignedIds}
            onShortcut={() => setSelectedId(null)}
          />
        </AppBar>
        <div className="min-h-0 flex-1">
          {selected ? (
            <PatientView
              patient={selected}
              roster={roster}
              onBack={() => setSelectedId(null)}
              onNavigate={setSelectedId}
            />
          ) : (
            <CnaAssignmentView items={assignment} onOpenPatient={(p) => setSelectedId(p.id)} />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50 font-['Figtree'] text-neutral-900">
      <ShiftProvider>
        <ShiftFlow />
      </ShiftProvider>
    </div>
  );
}

export default App;
