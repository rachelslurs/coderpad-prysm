// data/careTasks.ts — the structured documentation model (thin but real).
//
// A CNA charts with structured inputs only — segmented choices, steppers for
// vitals, fixed meal items — never freeform text. Each task carries the resident's
// "normal / last value" as a read-only reference (CNAs can *view* the normal but
// not pull it in — that's a nurse-only action). Vitals also expose recent history
// for trend awareness.
import { PATIENTS, type Patient } from "./patients";

export type VitalField = {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  /** Read-only reference range. */
  normal: string;
};

export type DocTask = { id: string; label: string } & (
  | { kind: "vitals"; fields: VitalField[]; recent: { at: string; summary: string }[] }
  | { kind: "choice"; options: string[]; normal: string; last: string }
  | { kind: "meal"; items: string[]; amounts: string[]; normal: string; last: string }
);

export const CARE_TASKS: DocTask[] = [
  {
    id: "vitals",
    label: "Vital Signs",
    kind: "vitals",
    fields: [
      { id: "sys", label: "Systolic", unit: "mmHg", min: 70, max: 200, normal: "100–130" },
      { id: "dia", label: "Diastolic", unit: "mmHg", min: 40, max: 120, normal: "60–80" },
      { id: "hr", label: "Heart rate", unit: "bpm", min: 40, max: 160, normal: "60–90" },
      { id: "spo2", label: "SpO₂", unit: "%", min: 80, max: 100, normal: "≥ 95" },
    ],
    recent: [
      { at: "04:00", summary: "126/78 · HR 80 · 96%" },
      { at: "00:00", summary: "130/82 · HR 84 · 95%" },
      { at: "20:00", summary: "128/80 · HR 78 · 97%" },
    ],
  },
  { id: "repositioning", label: "Repositioning", kind: "choice", options: ["Left side", "Right side", "Back", "Up in chair"], normal: "q2h, off back", last: "Right side · 04:00" },
  { id: "meal", label: "Meal Intake", kind: "meal", items: ["Oatmeal", "Scrambled eggs", "Orange juice", "Coffee"], amounts: ["Refused", "¼", "½", "¾", "All"], normal: "Usually ~75%", last: "¾ · last meal" },
  { id: "toileting", label: "Toileting / Continence", kind: "choice", options: ["Continent", "Incontinent — changed", "Declined"], normal: "Continent, 1 assist", last: "Continent · 06:40" },
  { id: "mobility", label: "Mobility", kind: "choice", options: ["Bed rest", "Chair", "Ambulated", "Declined"], normal: "Ambulates, 1 assist", last: "Chair ×20m · 21:00" },
  { id: "pain", label: "Pain Check", kind: "choice", options: ["None (0)", "Mild (1–3)", "Moderate (4–6)", "Severe (7+)"], normal: "Usually 0–2", last: "0/10 · 07:30" },
];

/** The tasks a resident is charted on this shift (sliced to their task count). */
export const tasksForResident = (patient: Patient): DocTask[] =>
  CARE_TASKS.slice(0, patient.tasksTotal);

// --- logged entries (a CNA's documentation) ---

export type LogEntry = {
  id: string;
  residentId: number;
  taskId: string;
  value: string;
  /** CNA id who recorded it. */
  by: string;
  /** Epoch ms. */
  at: number;
};

const sampleValue = (task: DocTask): string => {
  if (task.kind === "vitals") return "126/78 · HR 80 · 96%";
  if (task.kind === "meal") return "½";
  return task.options[0];
};

/** Seed earlier-logged entries so progress reflects the day already in motion. */
export const seedInitialLog = (cnaId: string, now: number): LogEntry[] =>
  PATIENTS.flatMap((p) =>
    tasksForResident(p)
      .slice(0, p.tasksDone)
      .map((t, i) => ({
        id: `seed-${p.id}-${t.id}`,
        residentId: p.id,
        taskId: t.id,
        value: sampleValue(t),
        by: cnaId,
        at: now - (i + 1) * 12 * 60_000,
      }))
  );

/** Distinct tasks logged for a resident (their completed-task count). */
export const doneCount = (patient: Patient, log: LogEntry[]): number =>
  new Set(log.filter((e) => e.residentId === patient.id).map((e) => e.taskId)).size;

/** The latest entry for a resident's task, if any. */
export const entryFor = (log: LogEntry[], residentId: number, taskId: string): LogEntry | undefined =>
  log.reduce<LogEntry | undefined>(
    (latest, e) =>
      e.residentId === residentId && e.taskId === taskId && (!latest || e.at >= latest.at) ? e : latest,
    undefined
  );
