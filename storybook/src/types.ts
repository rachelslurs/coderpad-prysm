// Canonical domain types for the design system. Components own the shape of the
// data they render so they don't reach back into any app's data layer.
//
// This is intentionally kept structurally identical to the app's patient fixture
// (`app/data/patients.ts`). Structural typing lets the app pass its own `Patient`
// values straight into these components without a conversion layer.

export type PatientStatus = "Stable" | "Needs Attention" | "Critical";

export type Patient = {
  id: number;
  name: string;
  room: string;
  age: number;
  physician: string;
  status: PatientStatus;
  diagnosis: string;
  admittedOn: string;
  insurance: string;
};
