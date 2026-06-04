import { useState, type ReactNode } from "react";
import { Badge, Button, Section, Segmented, Select, Toggle } from "@prysm/design-system";
import { PATIENTS, type Patient } from "../../data/patients";
import { CARE_TASKS, entryFor, tasksForResident, type DocTask } from "../../data/careTasks";
import type { AssignmentItem } from "../lib/assignment";
import { formatRoom } from "../lib/format";
import { useShift } from "../state/shiftContext";

type BatchDocumentationProps = {
  /** The CNA's assignment — the default set; "show all" widens to the unit. */
  items: AssignmentItem[];
};

// Tasks that batch cleanly in one pass (a single segmented choice). Vitals are
// per-resident and stay on the patient view.
const BATCH_TASKS = CARE_TASKS.filter((t): t is Extract<DocTask, { kind: "choice" | "meal" }> =>
  t.kind === "choice" || t.kind === "meal"
);

const optionsFor = (task: Extract<DocTask, { kind: "choice" | "meal" }>): string[] =>
  task.kind === "meal" ? task.amounts : task.options;

// Batch documentation (Jenna's favourite): document one task type across many
// residents in a single pass — e.g. meal intake while collecting trays. Includes
// residents outside the assignment (the persistent search also reaches anyone),
// plus a beginning-of-shift presence check.
export default function BatchDocumentation({ items }: BatchDocumentationProps) {
  const { logEntries, logEntry } = useShift();
  const [mode, setMode] = useState<"task" | "presence">("task");
  const [taskId, setTaskId] = useState(BATCH_TASKS[0].id);
  const [showAll, setShowAll] = useState(false);
  const [present, setPresent] = useState<Record<number, boolean>>({});

  const assignmentIds = new Set(items.map((i) => i.patient.id));
  const base = showAll ? PATIENTS : items.map((i) => i.patient);

  const task = BATCH_TASKS.find((t) => t.id === taskId)!;
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
            { value: "task", label: "Document a task" },
            { value: "presence", label: "Presence check" },
          ]}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        {mode === "task" && (
          <div className="w-full max-w-xs">
            <Select
              label="Task"
              options={BATCH_TASKS.map((t) => ({ value: t.id, label: t.label }))}
              selectedKey={taskId}
              onSelectionChange={(k) => setTaskId(String(k))}
            />
          </div>
        )}
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
          <Toggle isSelected={showAll} onChange={setShowAll} aria-label="Include residents outside my assignment" />
          Include all unit residents
        </label>
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
        <Section title={`${task.label} · ${taskResidents.length} residents`}>
          <div className="overflow-hidden rounded-md border border-neutral-200">
            {taskResidents.map((p, i) => (
              <BatchRow key={p.id} patient={p} off={!assignmentIds.has(p.id)} divided={i > 0}>
                <Segmented
                  variant="picker"
                  label={`${p.name} — ${task.label}`}
                  options={optionsFor(task)}
                  value={entryFor(logEntries, p.id, taskId)?.value ?? ""}
                  onChange={(v) => logEntry({ residentId: p.id, taskId, value: v })}
                />
              </BatchRow>
            ))}
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
              Off
            </Badge>
          )}
        </div>
      </div>
      <div className="min-w-[260px] flex-1">{children}</div>
    </div>
  );
}
