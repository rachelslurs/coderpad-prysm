import { useState } from "react";
import { AppBar, SyncStatus } from "@prysm/design-system";
import { Wifi, WifiOff } from "lucide-react";
import { PATIENTS, type Patient } from "../data/patients.ts";
import AssignmentSelection from "./components/AssignmentSelection.tsx";
import BatchDocumentation from "./components/BatchDocumentation.tsx";
import CnaAssignmentView from "./components/CnaAssignmentView.tsx";
import ClockIn from "./components/ClockIn.tsx";
import NavRail, { type NavView } from "./components/NavRail.tsx";
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
  const [view, setView] = useState<NavView>("assignment");
  // SNF wifi is unreliable — never show stale data silently. (Toggle simulates it.)
  const [online, setOnline] = useState(true);

  if (!clockedInAt) return <ClockIn />;
  if (!assignment) return <AssignmentSelection onConfirm={setAssignment} />;

  const roster = effectiveRoster(assignment)
    .map((i) => i.patient)
    .sort(byRoom);
  const selected = selectedId != null ? PATIENTS.find((p) => p.id === selectedId) : undefined;
  const assignedIds = new Set(assignment.map((i) => i.patient.id));

  const openPatient = (id: Patient["id"]) => {
    setView("assignment");
    setSelectedId(id);
  };

  // In-shift shell: the nav rail AND the app bar (with search) are persistent so
  // the chrome never moves between screens. Pressing "/" returns to the roster
  // and focuses search.
  return (
    <div className="flex h-full">
      <NavRail
        active={view}
        onNavigate={(v) => {
          setView(v);
          setSelectedId(null);
        }}
      />
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
          end={
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOnline((o) => !o)}
                aria-label={online ? "Simulate going offline" : "Reconnect"}
                title={online ? "Connected — tap to simulate offline" : "Offline — tap to reconnect"}
                className="rounded p-1 text-neutral-400 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4 text-warning-600" />}
              </button>
              <SyncStatus state={online ? "saved" : "queued"} note={online ? "just now" : "offline"} />
            </div>
          }
        >
          <ResidentSearch
            onSelect={(p) => openPatient(p.id)}
            assignedIds={assignedIds}
            onShortcut={() => {
              setView("assignment");
              setSelectedId(null);
            }}
          />
        </AppBar>
        {!online && (
          <div className="flex flex-none items-center gap-2 border-b border-warning-200 bg-warning-50 px-5 py-2 text-sm font-semibold text-warning-800">
            <WifiOff aria-hidden="true" className="h-4 w-4 flex-none" />
            Offline — showing the last synced data. New entries are saved and will sync when you reconnect.
          </div>
        )}
        <div className="min-h-0 flex-1">
          {view === "batch" ? (
            <BatchDocumentation items={assignment} />
          ) : selected ? (
            <PatientView
              patient={selected}
              roster={roster}
              onBack={() => setSelectedId(null)}
              onNavigate={setSelectedId}
            />
          ) : (
            <CnaAssignmentView items={assignment} onOpenPatient={(p) => openPatient(p.id)} />
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
