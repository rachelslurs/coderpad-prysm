// data/assignment.ts — the shift assignments a supervisor defines.
//
// A supervisor lays out the unit as a few named assignments (groups of
// residents). A CNA is handed one by default but can switch to another whole
// assignment (the preferred, lower-friction adjustment). Editing residents
// one-by-one is the last resort (see the gate UI).
import { PATIENTS, type Patient } from "./patients";

export type AssignmentDef = {
  id: string;
  label: string;
  patientIds: ReadonlyArray<Patient["id"]>;
};

// Supervisor-defined groups for 1 North. The first is the one A. Reyes was handed.
export const ASSIGNMENTS: ReadonlyArray<AssignmentDef> = [
  { id: "north-full", label: "1 North · Full", patientIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: "north-a", label: "1 North · Hall A", patientIds: [1, 2, 3, 4, 5] },
  { id: "north-b", label: "1 North · Hall B", patientIds: [6, 7, 8, 9, 10] },
];

export const DEFAULT_ASSIGNMENT_ID = ASSIGNMENTS[0].id;

const byId = new Map(PATIENTS.map((p) => [p.id, p]));

export const assignmentDef = (id: string): AssignmentDef =>
  ASSIGNMENTS.find((a) => a.id === id) ?? ASSIGNMENTS[0];

/** The residents in an assignment, resolved to `Patient`s in supervisor order. */
export const patientsForAssignment = (id: string): Patient[] =>
  assignmentDef(id)
    .patientIds.map((pid) => byId.get(pid)!)
    .filter(Boolean);

/** Unit residents NOT in this assignment — the pool the CNA could request to add. */
export const unassignedForAssignment = (id: string): Patient[] => {
  const inSet = new Set(assignmentDef(id).patientIds);
  return PATIENTS.filter((p) => !inSet.has(p.id));
};
