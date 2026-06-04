// lib/assignment.ts — the CNA's working assignment model.
//
// An "assignment" is the group of residents the CNA is agreeing to care for
// this shift. It starts from the supervisor's pre-assigned list and can be
// adjusted (remove/add) — but adjustments are requests routed to a supervisor,
// not edits that take effect now, and they never block starting the shift.
import type { Patient } from "../../data/patients";
import {
  DEFAULT_ASSIGNMENT_ID,
  patientsForAssignment,
} from "../../data/assignment";

/**
 * A resident's standing on the assignment:
 * - `assigned` — on the supervisor's list, accepted as-is.
 * - `removal-requested` — the CNA asked to drop them; pending supervisor review,
 *   so they fall off the CNA's effective roster for the shift.
 * - `addition-requested` — the CNA asked to take an extra resident; pending
 *   review, but they care for them now, so they show on the roster (flagged).
 */
export type AssignmentState =
  | "assigned"
  | "removal-requested"
  | "addition-requested";

export type AssignmentItem = {
  patient: Patient;
  state: AssignmentState;
  /** Why the CNA requested the change — captured as friction, sent to the supervisor. */
  reason?: string;
};

/** A supervisor-defined assignment, every resident accepted as handed over. */
export const buildInitialAssignment = (
  assignmentId: string = DEFAULT_ASSIGNMENT_ID
): AssignmentItem[] =>
  patientsForAssignment(assignmentId).map((patient) => ({
    patient,
    state: "assigned",
  }));

/** Has the CNA touched the supervisor's list at all? Drives the "pending" summary. */
export const hasPendingRequests = (items: AssignmentItem[]): boolean =>
  items.some((i) => i.state !== "assigned");

/**
 * The residents the CNA is actually responsible for once the shift starts:
 * everyone except those they've asked to drop. Addition requests stay in (the
 * CNA is covering them now), just flagged as pending elsewhere. Triage grouping
 * and ordering of this set live in `lib/triage.ts` (the single source of truth).
 */
export const effectiveRoster = (items: AssignmentItem[]): AssignmentItem[] =>
  items.filter((i) => i.state !== "removal-requested");
