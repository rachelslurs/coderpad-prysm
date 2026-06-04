import { useState, type ReactNode } from "react";
import { Badge, Button, Section, Segmented, SyncStatus, Toggle } from "@prysm/design-system";
import { PATIENTS, type Patient } from "../../data/patients";
import { CARE_TASKS, entryFor, tasksForResident, type DocTask } from "../../data/careTasks";
import type { AssignmentItem } from "../lib/assignment";
import { formatRoom } from "../lib/format";
import { formatClock, useShift } from "../state/shiftContext";

type BatchDocumentationProps = {
  /** The CNA's assignment — the default set; "show all" widens to the unit. */
  items: AssignmentItem[];
};

// Batch documentation covers meal intake only — the one task that reliably batches
// in a single pass (e.g. logging trays while you collect them). Everything else is
// per-resident judgement and stays on the patient view.
const MEAL_TASK = CARE_TASKS.find(
  (t): t is Extract<DocTask, { kind: "meal" }> => t.kind === "meal"
)!;

// Batch documentation (Jenna's favourite): log meal intake across many residents in
// a single pass. Includes residents outside the assignment (the persistent search
// also reaches anyone), plus a beginning-of-shift presence check.
export default function BatchDocumentation({ items }: BatchDocumentationProps) {
  const { logEntries, logEntry } = useShift();
  const [mode, setMode] = useState<"task" | "presence">("task");
  const [showAll, setShowAll] = useState(false);
  const [present, setPresent] = useState<Record<number, boolean>>({});

  const assignmentIds = new Set(items.map((i) => i.patient.id));
  const base = showAll ? PATIENTS : items.map((i) => i.patient);

  const taskId = MEAL_TASK.id;
  const taskResidents = base.filter((p) => tasksForResident(p).some((t) => t.id === taskId));
  const presentCount = base.filter((p) => present[p.id]).length;

  return (
    <div className="h-full overflow-y-auto px-6 py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold tracking-tight text-neutral-900">Batch documentation</h1>
        <Segmented
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as "task" | "presence")}
          options={[
            { value: "task", label: "Meal intake" },
            { value: "presence", label: "Presence check" },
          ]}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="w-fit">
          <Toggle isSelected={showAll} onChange={setShowAll}>
            <span className="text-sm font-semibold text-neutral-600">Include all unit residents</span>
          </Toggle>
        </div>
        {mode === "presence" && (
          <span className="text-sm font-semibold text-neutral-500">
            <span className="tabular-nums text-neutral-900">{presentCount}</span> / {base.length} present
            <Button
              className="ml-3"
              size="sm"
              variant="outline"
              onClick={() => setPresent(Object.fromEntries(base.map((p) => [p.id, true])))}
            >
              Mark all present
            </Button>
          </span>
        )}
      </div>

      {mode === "task" ? (
        <Section title={`${MEAL_TASK.label} · ${taskResidents.length} residents`}>
          <div className="overflow-hidden rounded-md border border-neutral-200">
            {taskResidents.map((p, i) => {
              const entry = entryFor(logEntries, p.id, taskId);
              return (
                <BatchRow key={p.id} patient={p} off={!assignmentIds.has(p.id)} divided={i > 0}>
                  <div className="flex flex-wrap items-center gap-3">
                    <Segmented
                      variant="picker"
                      label={`${p.name} — ${MEAL_TASK.label}`}
                      options={MEAL_TASK.amounts}
                      value={entry?.value ?? ""}
                      onChange={(v) => logEntry({ residentId: p.id, taskId, value: v })}
                    />
                    {entry && <SyncStatus state="saved" note={formatClock(new Date(entry.at))} />}
                  </div>
                </BatchRow>
              );
            })}
          </div>
        </Section>
      ) : (
        <Section title={`Everyone present and where they should be · ${base.length}`}>
          <div className="overflow-hidden rounded-md border border-neutral-200">
            {base.map((p, i) => (
              <BatchRow key={p.id} patient={p} off={!assignmentIds.has(p.id)} divided={i > 0}>
                <Toggle
                  isSelected={!!present[p.id]}
                  onChange={(v) => setPresent((s) => ({ ...s, [p.id]: v }))}
                  aria-label={`${p.name} present`}
                >
                  <span className="text-sm font-semibold text-neutral-600">
                    {present[p.id] ? "Present" : "Mark present"}
                  </span>
                </Toggle>
              </BatchRow>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function BatchRow({
  patient,
  off,
  divided,
  children,
}: {
  patient: Patient;
  off: boolean;
  divided: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-4 bg-white px-4 py-3 ${divided ? "border-t border-neutral-100" : ""}`}>
      <div className="w-44 flex-none">
        <div className="font-bold text-neutral-900">{patient.name}</div>
        <div className="flex items-center gap-1.5 text-sm text-neutral-500">
          Room {formatRoom(patient.room)}
          {off && (
            <Badge tone="neutral" size="sm">
              Covering
            </Badge>
          )}
        </div>
      </div>
      <div className="min-w-[260px] flex-1">{children}</div>
    </div>
  );
}
