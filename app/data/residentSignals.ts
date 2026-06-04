// data/residentSignals.ts — per-resident task urgency + care meta.
//
// What's a *risk* lives on the resident's `flags` (data/patients.ts) and is
// ranked in `src/lib/triage.ts`. This file holds the non-flag care meta: how
// soon the next task is due (a triage tiebreak), transfer need, and task counts.
import type { Patient } from "./patients";

/** Mobility / transfer assistance a resident needs — drives the scan-line icon. */
export type TransferNeed =
  | "independent"
  | "one-assist"
  | "two-person"
  | "mechanical-lift";

export type ResidentSignals = {
  /** Minutes until the next time-sensitive task is due. `null` = nothing pending. */
  taskDueInMin: number | null;
  /** Transfer assistance need — rendered as a hoverable scan-line icon. */
  transfer: TransferNeed;
  /** Care tasks completed / scheduled this shift — the task-progress ring. */
  tasksDone: number;
  tasksTotal: number;
};

const DEFAULT: ResidentSignals = {
  taskDueInMin: null,
  transfer: "independent",
  tasksDone: 0,
  tasksTotal: 0,
};

const SIGNALS: Record<Patient["id"], ResidentSignals> = {
  1: { taskDueInMin: 10,   transfer: "mechanical-lift", tasksDone: 1, tasksTotal: 6 },
  2: { taskDueInMin: 25,   transfer: "two-person",      tasksDone: 2, tasksTotal: 6 },
  3: { taskDueInMin: null, transfer: "two-person",      tasksDone: 0, tasksTotal: 4 },
  4: { taskDueInMin: 60,   transfer: "independent",     tasksDone: 3, tasksTotal: 6 },
  5: { taskDueInMin: 30,   transfer: "one-assist",      tasksDone: 4, tasksTotal: 6 },
  6: { taskDueInMin: 90,   transfer: "one-assist",      tasksDone: 5, tasksTotal: 6 },
  7: { taskDueInMin: 35,   transfer: "independent",     tasksDone: 2, tasksTotal: 6 },
  8: { taskDueInMin: null, transfer: "one-assist",      tasksDone: 6, tasksTotal: 6 },
};

/** Care meta for a resident; absent residents read as a quiet default. */
export const signalsFor = (id: Patient["id"]): ResidentSignals =>
  SIGNALS[id] ?? DEFAULT;
