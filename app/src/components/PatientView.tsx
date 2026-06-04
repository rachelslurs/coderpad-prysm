import { useState } from "react";
import { Button, Section, TaskProgress, toInitials } from "@prysm/design-system";
import {
  Activity,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Droplets,
  Footprints,
  Gauge,
  RotateCw,
  SquarePen,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { Patient } from "../../data/patients";
import { type DocTask, doneCount, entryFor, tasksForResident } from "../../data/careTasks";
import { formatRoom } from "../lib/format";
import { progressTone } from "../lib/residentDisplay";
import { formatClock, useShift } from "../state/shiftContext";
import CareIconRow from "./CareIconRow";
import TaskInput from "./TaskInput";

type PatientViewProps = {
  patient: Patient;
  /** The CNA's roster, sorted by room — the set the pager walks. */
  roster: Patient[];
  onBack: () => void;
  onNavigate: (id: Patient["id"]) => void;
};

const lastOf = (task: DocTask): string => (task.kind === "vitals" ? task.recent[0].summary : task.last);

// Per-task icon for the documentation checklist rail.
const TASK_ICON: Record<string, LucideIcon> = {
  vitals: Activity,
  repositioning: RotateCw,
  meal: Utensils,
  toileting: Droplets,
  mobility: Footprints,
  pain: Gauge,
};

function PagerButton({
  dir,
  resident,
  onNavigate,
}: {
  dir: "prev" | "next";
  resident: Patient | undefined;
  onNavigate: (id: Patient["id"]) => void;
}) {
  const Chevron = dir === "prev" ? ChevronLeft : ChevronRight;
  const label = dir === "prev" ? "Previous" : "Next";
  const chevron = <Chevron aria-hidden="true" className="h-5 w-5 flex-none text-neutral-500" />;
  return (
    <button
      type="button"
      disabled={!resident}
      onClick={() => resident && onNavigate(resident.id)}
      className="flex min-h-[52px] w-full min-w-0 items-center gap-2 rounded border border-neutral-200 bg-white px-2.5 py-1.5 enabled:hover:border-accent-500 enabled:hover:bg-accent-50 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      {dir === "prev" && chevron}
      <span className={`min-w-0 flex-1 ${dir === "next" ? "text-right" : ""}`}>
        <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400">{label}</span>
        <span className="block truncate text-sm font-bold text-neutral-900">
          {resident ? resident.name : "— None —"}
        </span>
        {resident && <span className="block text-xs font-semibold text-neutral-500">Room {resident.room}</span>}
      </span>
      {dir === "next" && chevron}
    </button>
  );
}

// The Patient View — "Station two-column". The identity column is shared between
// the read-only overview and documentation. The overview stays put until the CNA
// chooses to log; entering documentation swaps the prev/next pager for a tasks
// list and shows the structured inputs on the right.
export default function PatientView({ patient, roster, onBack, onNavigate }: PatientViewProps) {
  const { logEntries, logEntry, strikeEntry } = useShift();
  const [docTaskId, setDocTaskId] = useState<string | null>(null);

  const tasks = tasksForResident(patient);
  const total = patient.tasksTotal;
  const done = doneCount(patient, logEntries);
  const remaining = total - done;
  const tone = progressTone(done, total);

  const idx = roster.findIndex((r) => r.id === patient.id);
  const prev = idx >= 0 ? roster[idx - 1] : undefined;
  const next = idx >= 0 ? roster[idx + 1] : undefined;

  const documenting = docTaskId !== null;
  const selected = tasks.find((t) => t.id === docTaskId);
  const enterDoc = (id?: string) => setDocTaskId(id ?? tasks[0]?.id ?? null);

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      <div className="flex flex-none items-center gap-4 border-b border-neutral-200 bg-white px-5 py-2.5">
        <Button variant="ghost" tone="accent" iconLeft={ArrowLeft} onClick={onBack}>
          Back to assignment
        </Button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Shared identity column. Footer swaps pager (overview) ↔ back (documenting). */}
        <aside className="flex w-[344px] flex-none flex-col border-r border-neutral-200 bg-neutral-50">
          <div className="flex-1 overflow-y-auto [scrollbar-gutter:stable_both-edges]">
            <div className="flex flex-col items-center px-6 pt-6 text-center">
              <div className="h-36 w-36 overflow-hidden rounded-full border border-accent-100 bg-accent-50">
                {patient.photoUrl ? (
                  <img src={patient.photoUrl} alt={patient.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-extrabold text-accent-700">
                    {toInitials(patient.name)}
                  </div>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-neutral-900">
                {patient.name}
              </h1>
              <div className="mt-1 text-xl font-bold text-neutral-700">Room {formatRoom(patient.room)}</div>
              <div className="text-sm font-semibold tabular-nums text-neutral-500">
                {patient.age} · {patient.sex}
              </div>
              <div className="mt-1.5 text-sm font-medium text-neutral-500">
                {patient.diagnosis}
                {patient.stay && <> · {patient.stay}</>}
              </div>
              <div className="mt-3.5">
                <CareIconRow patient={patient} />
              </div>
            </div>

            <div className="px-6 pb-6 pt-8">
              <Section title="Today's care">
                <TaskProgress variant="bar" value={done} total={total} tone={tone} label="Tasks complete" />
                <p className="mt-2.5 text-[13px] font-semibold text-neutral-500">
                  {remaining === 0 ? "All tasks complete for this shift." : `${remaining} task${remaining === 1 ? "" : "s"} remaining`}
                </p>
              </Section>
            </div>

            {/* Tasks list — only while documenting (replaces the patient pager). */}
            {documenting && (
              <div className="px-6 pb-6">
                <ul className="space-y-0.5">
                  {tasks.map((t) => {
                      const logged = !!entryFor(logEntries, patient.id, t.id);
                      const active = t.id === docTaskId;
                      const Icon = TASK_ICON[t.id] ?? ClipboardList;
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => setDocTaskId(t.id)}
                            aria-current={active ? "true" : undefined}
                            className={`flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm font-semibold transition-colors ${
                              active
                                ? "bg-accent-50 text-accent-900 ring-1 ring-inset ring-accent-200"
                                : "text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            <Icon
                              aria-hidden="true"
                              className={`h-4 w-4 flex-none ${
                                logged ? "text-success-600" : active ? "text-accent-600" : "text-neutral-400"
                              }`}
                            />
                            <span className="min-w-0 flex-1 truncate">{t.label}</span>
                            {logged ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-success-700">
                                <Check aria-hidden="true" className="h-3.5 w-3.5" /> Done
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="flex-none p-4">
            {documenting ? (
              <Button variant="outline" tone="neutral" iconLeft={ArrowLeft} className="w-full" onClick={() => setDocTaskId(null)}>
                Back to overview
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <PagerButton dir="prev" resident={prev} onNavigate={onNavigate} />
                <PagerButton dir="next" resident={next} onNavigate={onNavigate} />
              </div>
            )}
          </div>
        </aside>

        {/* Right pane: read-only overview, or the structured input while documenting. */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-white px-7 py-6">
          {documenting && selected ? (
            <div className="mx-auto max-w-2xl">
              <div className="mb-1 text-xs font-bold uppercase tracking-widest text-accent-700">Documenting</div>
              <TaskInput
                task={selected}
                entry={entryFor(logEntries, patient.id, selected.id)}
                onLog={(value) => logEntry({ residentId: patient.id, taskId: selected.id, value })}
                onStrike={(reason) => {
                  const e = entryFor(logEntries, patient.id, selected.id);
                  if (e) strikeEntry(e.id, reason);
                }}
              />
            </div>
          ) : (
            <>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Care tasks</h2>
              <div className="overflow-hidden rounded-md border border-neutral-200">
                {tasks.map((task, i) => {
                  const entry = entryFor(logEntries, patient.id, task.id);
                  const Icon = TASK_ICON[task.id] ?? ClipboardList;
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center gap-4 px-4 py-4 ${i > 0 ? "border-t border-neutral-100" : ""} ${
                        entry ? "bg-success-50" : "bg-white"
                      }`}
                    >
                      <span
                        className={`grid h-7 w-7 flex-none place-items-center rounded-full ${
                          entry ? "bg-success-600 text-white" : "border-2 border-neutral-200 text-neutral-400"
                        }`}
                      >
                        {entry ? <Check aria-hidden="true" className="h-4 w-4" /> : <Icon aria-hidden="true" className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-bold leading-tight text-neutral-900">{task.label}</div>
                        <div className="truncate text-sm text-neutral-500">
                          {entry ? (
                            <span className="font-semibold text-success-700">
                              Logged {formatClock(new Date(entry.at))} · {entry.value}
                            </span>
                          ) : (
                            <>Last: {lastOf(task)}</>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" iconLeft={SquarePen} onClick={() => enterDoc(task.id)}>
                        {entry ? "Update" : "Document"}
                      </Button>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-neutral-400">
                Structured input only — segmented controls, steppers, fixed meal items. No freeform text.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
