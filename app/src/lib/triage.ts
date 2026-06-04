// lib/triage.ts — the SINGLE source of truth for assignment sort order.
//
// The first 10 minutes of a shift are prioritization, so this — not room number —
// is the default order of the list, but room orders *within* each tier (how CNAs
// think about the floor):
//   0. Time-sensitive tasks (must happen by a set time)
//   1. Active clinical alerts (high fall risk / elopement — not subdivided)
//   2. Everyone else
import { hasAlert, type Patient } from "../../data/patients";
import type { AssignmentItem } from "./assignment";

const tier = (p: Patient): number => (p.timeSensitive ? 0 : hasAlert(p) ? 1 : 2);

export const byPriority = (a: Patient, b: Patient): number => {
  const ta = tier(a);
  const tb = tier(b);
  if (ta !== tb) return ta - tb;
  return a.room.localeCompare(b.room, undefined, { numeric: true });
};

/** The assignment as one sorted list (tier, then room). Triage is order, not size. */
export const rosterItems = (items: AssignmentItem[]): AssignmentItem[] =>
  [...items].sort((a, b) => byPriority(a.patient, b.patient));
