import {
  AppBar,
  Button,
  IconTile,
  Section,
  TaskProgress,
  toInitials,
} from "@prysm/design-system";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cloud,
  History,
  SquarePen,
} from "lucide-react";
import type { Patient } from "../../data/patients";
import { formatRoom } from "../lib/format";
import { progressTone, updatedAgo } from "../lib/residentDisplay";
import CareIconRow from "./CareIconRow";

type PatientViewProps = {
  patient: Patient;
  /** The CNA's roster, sorted by room — the set the pager walks. */
  roster: Patient[];
  onBack: () => void;
  onNavigate: (id: Patient["id"]) => void;
};

// Standard CNA care tasks. The per-resident task list is stubbed for now — we
// render this set sliced to the resident's task total and mark the first N done
// from their progress count. Prior readings arrive in a later pass.
const STUB_TASKS = [
  "Vital Signs",
  "Repositioning",
  "Meal Intake",
  "Toileting / Continence",
  "Mobility",
  "Pain Check",
];

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
        {resident && (
          <span className="block text-xs font-semibold text-neutral-500">Room {resident.room}</span>
        )}
      </span>
      {dir === "next" && chevron}
    </button>
  );
}

// The Patient View — "Station two-column". Identity, flags and progress pin to a
// left rail while the CNA works the task list on the right, so context never
// scrolls away on a wide monitor. Opens when a resident on the assignment is
// pressed (replacing the side drawer). Triage colour is signal-based.
export default function PatientView({ patient, roster, onBack, onNavigate }: PatientViewProps) {
  const { tasksDone, tasksTotal, transfer } = patient;
  const tone = progressTone(patient);
  const remaining = tasksTotal - tasksDone;

  const idx = roster.findIndex((r) => r.id === patient.id);
  const prev = idx >= 0 ? roster[idx - 1] : undefined;
  const next = idx >= 0 ? roster[idx + 1] : undefined;

  const tasks = STUB_TASKS.slice(0, tasksTotal);

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* Dark command bar */}
      <AppBar
        tone="dark"
        className="flex-none"
        start={
          <span className="flex items-baseline gap-3">
            <span className="text-lg font-extrabold tracking-tight">Prysm</span>
            <span className="hidden text-sm font-medium text-neutral-400 sm:inline">
              1 North · Day Shift · <span className="tabular-nums">06:48</span>
            </span>
          </span>
        }
        end={
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[13px] font-semibold text-neutral-300">
              <Cloud aria-hidden="true" className="h-4 w-4" />
              Synced · <span className="tabular-nums">2</span> queued
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-600 text-xs font-extrabold text-white">JM</span>
              Jenna McLaughlin
            </span>
          </>
        }
      />

      {/* Back to assignment */}
      <div className="flex flex-none items-center gap-4 border-b border-neutral-200 bg-white px-5 py-2.5">
        <Button variant="ghost" tone="accent" iconLeft={ArrowLeft} onClick={onBack}>
          Back to assignment
        </Button>
      </div>

      {/* Two columns */}
      <div className="flex min-h-0 flex-1">
        {/* Left rail — identity + progress, with the patient pager pinned to the bottom */}
        <aside className="flex w-[344px] flex-none flex-col border-r border-neutral-200 bg-neutral-50">
          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-neutral-200 px-6 py-6">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-accent-100 bg-accent-50">
                {patient.photoUrl ? (
                  <img src={patient.photoUrl} alt={patient.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-accent-700">
                    {toInitials(patient.name)}
                  </div>
                )}
              </div>
              <h1 className="mt-3.5 text-2xl font-extrabold leading-tight tracking-tight text-neutral-900">{patient.name}</h1>
              <div className="text-[15px] font-bold text-neutral-700">
                Room {formatRoom(patient.room)} · <span className="tabular-nums">{patient.age}</span> · {patient.sex}
              </div>
              <div className="mt-1.5 text-sm font-medium text-neutral-500">
                {patient.diagnosis}
                {patient.stay && <> · {patient.stay}</>}
              </div>
              <div className="mt-3.5">
                <CareIconRow patient={patient} />
              </div>
              <div className="mt-3.5 flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                <History aria-hidden="true" className="h-3.5 w-3.5" />
                Last updated {updatedAgo(patient)}
              </div>
            </div>
            <div className="px-6 py-6">
              <Section title="Today's care">
                <TaskProgress variant="bar" value={tasksDone} total={tasksTotal} tone={tone} label="Tasks complete" />
                <p className="mt-2.5 text-[13px] font-semibold text-neutral-500">
                  {remaining === 0 ? "All tasks complete for this shift." : `${remaining} task${remaining === 1 ? "" : "s"} remaining`}
                </p>
              </Section>
            </div>
          </div>
          <div className="grid flex-none grid-cols-2 gap-2 border-t border-neutral-200 p-4">
            <PagerButton dir="prev" resident={prev} onNavigate={onNavigate} />
            <PagerButton dir="next" resident={next} onNavigate={onNavigate} />
          </div>
        </aside>

        {/* Right work area — tasks */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-white px-7 py-6">
          <div className="mb-4 flex items-center gap-3">
            <IconTile icon={ClipboardList} tone="accent" />
            <div className="flex-1">
              <div className="text-[13px] font-bold uppercase tracking-widest text-neutral-500">
                Tasks · <span className="tabular-nums">{tasksDone}/{tasksTotal}</span>
              </div>
              <div className="text-sm font-semibold text-neutral-400">
                {remaining === 0 ? "Complete" : `${tasksDone} logged · ${remaining} to go`}
              </div>
            </div>
            <TaskProgress value={tasksDone} total={tasksTotal} size={52} tone={tone} label="Shift progress" />
          </div>

          <div className="overflow-hidden rounded-md border border-neutral-200">
            {tasks.map((name, i) => {
              const done = i < tasksDone;
              return (
                <div
                  key={name}
                  className={`grid grid-cols-[40px_minmax(140px,1.1fr)_minmax(130px,1fr)_140px] items-center gap-4 px-4 py-4 ${
                    i > 0 ? "border-t border-neutral-100" : ""
                  } ${done ? "bg-success-50" : "bg-white"}`}
                >
                  {done ? (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-success-600 text-white">
                      <Check aria-hidden="true" className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-neutral-200 text-xs font-extrabold text-neutral-400 tabular-nums">
                      {i + 1}
                    </span>
                  )}
                  <div className="text-[15px] font-bold leading-tight text-neutral-900">{name}</div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Last</div>
                    <div className="text-sm font-semibold text-neutral-400">— not yet wired —</div>
                  </div>
                  <div className="justify-self-end">
                    {done ? (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-success-700">
                        <Check aria-hidden="true" className="h-4 w-4" />
                        Logged
                      </span>
                    ) : (
                      <Button tone="accent" iconLeft={SquarePen} size="touch">
                        Document
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-neutral-400">
            Transfer: {transfer.replace("-", " ")} · documentation is structured-input only (steppers, segmented, Yes/No).
          </p>
        </main>
      </div>
    </div>
  );
}
