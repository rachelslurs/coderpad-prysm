import type { Patient } from "../types";

// Internal fixture for stories and tests only — intentionally NOT re-exported
// from the package barrel. The design system ships components, not data.
export const samplePatient: Patient = {
  id: 1,
  name: "Margaret Holloway",
  room: "101A",
  age: 82,
  physician: "Dr. Sandra Patel",
  status: "Stable",
  diagnosis: "Hip fracture post-op",
  admittedOn: "2024-03-12",
  insurance: "Medicare Part A",
};
