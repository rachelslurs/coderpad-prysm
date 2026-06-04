// lib/residentDisplay.ts — pure resident presentation helpers.
import type { Tone } from "@prysm/design-system";
import type { Patient } from "../../data/patients";

/** Secondary demographic line: age + sex. */
export const ageSex = (patient: Patient): string => `${patient.age} · ${patient.sex}`;

/** "Updated X ago" is stale past this many minutes (SNF wifi is unreliable). */
export const STALE_AFTER_MIN = 60;
export const isStale = (patient: Patient): boolean => patient.updatedMinAgo > STALE_AFTER_MIN;

/** Freshness label, e.g. "8m ago" / "1h 35m ago". */
export const updatedAgo = (patient: Patient): string => {
  const m = patient.updatedMinAgo;
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m ago` : `${h}h ago`;
};

/**
 * Tone for the task-progress ring — no triage colour tiers; neutral while work is
 * outstanding, success (emerald) the moment every task is done.
 */
export const progressTone = (done: number, total: number): Tone =>
  total > 0 && done === total ? "success" : "neutral";
