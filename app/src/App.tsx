import { useState } from "react";
import { PATIENTS, type Patient } from "../data/patients.ts";
import AssignmentSelection from "./components/AssignmentSelection.tsx";
import CnaAssignmentView from "./components/CnaAssignmentView.tsx";
import ClockIn from "./components/ClockIn.tsx";
import PatientView from "./components/PatientView.tsx";
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

  if (selected) {
    return (
      <PatientView
        patient={selected}
        roster={roster}
        onBack={() => setSelectedId(null)}
        onNavigate={setSelectedId}
      />
    );
  }
  return <CnaAssignmentView items={assignment} onOpenPatient={(p) => setSelectedId(p.id)} />;
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
