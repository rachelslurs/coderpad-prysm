import { useState } from "react";
import { PATIENTS, type Patient } from "../data/patients.ts";
import AssignmentSelection from "./components/AssignmentSelection.tsx";
import CnaAssignmentView from "./components/CnaAssignmentView.tsx";
import PatientView from "./components/PatientView.tsx";
import { effectiveRoster, type AssignmentItem } from "./lib/assignment.ts";

// The CNA's shift flow. Confirming the assignment is the preferred way to start,
// but it isn't a hard gate — the shift can start before an assignment is
// confirmed. Pressing a resident opens their patient view as its own page.
type Phase = "selection" | "shift";

const byRoom = (a: Patient, b: Patient) =>
  a.room.localeCompare(b.room, undefined, { numeric: true });

function App() {
  const [phase, setPhase] = useState<Phase>("selection");
  const [assignment, setAssignment] = useState<AssignmentItem[] | null>(null);
  const [selectedId, setSelectedId] = useState<Patient["id"] | null>(null);

  const startShift = (items: AssignmentItem[] | null) => {
    setAssignment(items);
    setPhase("shift");
  };

  // The patient view pages through the assignment in room order.
  const roster = assignment
    ? effectiveRoster(assignment)
        .map((i) => i.patient)
        .sort(byRoom)
    : [];
  const selected = selectedId != null ? PATIENTS.find((p) => p.id === selectedId) : undefined;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50 font-['Figtree'] text-neutral-900">
      {phase === "selection" ? (
        <AssignmentSelection
          onConfirm={(items) => startShift(items)}
          onStartWithoutAssignment={() => startShift(null)}
        />
      ) : selected ? (
        <PatientView
          patient={selected}
          roster={roster}
          onBack={() => setSelectedId(null)}
          onNavigate={setSelectedId}
        />
      ) : (
        <CnaAssignmentView
          items={assignment ?? []}
          onOpenPatient={(p) => setSelectedId(p.id)}
          onReviewAssignment={() => setPhase("selection")}
        />
      )}
    </div>
  );
}

export default App;
