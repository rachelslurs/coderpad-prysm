// lib/triage.ts — the SINGLE source of truth for shift triage.
//
// There is no "status" tier. A resident needs attention if they carry any flag;
// ordering is by the most urgent flag they hold, then by how soon their next
// task is due, then room. Changing the priority of a flag is a one-line edit
// here — nothing else encodes the criteria.
//
// Priority intent: safety first (is the resident where they should be?), then
// airway, then must-happen-by-a-time tasks, then routine precautions.
import type { FlagKind, Patient } from "../../data/patients";
import { signalsFor } from "../../data/residentSignals";
import type { AssignmentItem } from "./assignment";

const FLAG_PRIORITY: Record<FlagKind, number> = {
  Elopement: 4, // safety / wandering
  Aspiration: 3, // airway
  "Time-Sensitive": 3, // must happen by a set time
  "Wound Care": 2,
  "Fall Risk": 2,
};

/** The rank of a resident's most urgent flag (0 when unflagged). */
const flagRank = (patient: Patient): number =>
  patient.flags.reduce((max, f) => Math.max(max, FLAG_PRIORITY[f.kind] ?? 1), 0);

/** A resident needs attention when they carry any flag. */
export const needsAttention = (patient: Patient): boolean => patient.flags.length > 0;

/**
 * The one comparator, highest-priority-first. Used for BOTH the cluster and the
 * roster so the two never drift.
 */
export const byPriority = (a: Patient, b: Patient): number => {
  const ra = flagRank(a);
  const rb = flagRank(b);
  if (ra !== rb) return rb - ra; // more urgent flag first
  const da = signalsFor(a.id).taskDueInMin ?? Number.POSITIVE_INFINITY;
  const db = signalsFor(b.id).taskDueInMin ?? Number.POSITIVE_INFINITY;
  if (da !== db) return da - db; // soonest task next
  return a.room.localeCompare(b.room, undefined, { numeric: true });
};

const byItemPriority = (a: AssignmentItem, b: AssignmentItem) =>
  byPriority(a.patient, b.patient);

/** The pinned cluster: flagged residents, highest priority first. */
export const needsAttentionItems = (items: AssignmentItem[]): AssignmentItem[] =>
  items.filter((i) => needsAttention(i.patient)).sort(byItemPriority);

/** The full roster, triage-sorted (flag priority, then soonest task, then room). */
export const rosterItems = (items: AssignmentItem[]): AssignmentItem[] =>
  [...items].sort(byItemPriority);
