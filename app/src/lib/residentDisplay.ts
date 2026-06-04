// lib/residentDisplay.ts — pure resident presentation helpers.
import type { Tone } from "@prysm/design-system";
import type { Patient } from "../../data/patients";
import { signalsFor } from "../../data/residentSignals";

/** Secondary demographic line: age + sex. */
export const ageSex = (patient: Patient): string => `${patient.age} · ${patient.sex}`;

/**
 * Tone for the task-progress ring/bar. There are no triage colour tiers — the
 * fill is neutral while work is outstanding and flips to success (emerald) the
 * moment every task is done. Completion is the only thing colour signals here.
 */
export const progressTone = (patient: Patient): Tone => {
  const s = signalsFor(patient.id);
  return s.tasksTotal > 0 && s.tasksDone === s.tasksTotal ? "success" : "neutral";
};
