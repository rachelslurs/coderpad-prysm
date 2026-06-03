// Public API of the @prysm/design-system package. Consumers (the app, other
// packages) import everything from here, never from deep paths.

export { default as StatusBadge } from "./components/StatusBadge";
export { default as PatientDetail } from "./components/PatientDetail";
export { formatRoom, toInitials, calculateLOS } from "./lib/format";
export type { Patient, PatientStatus } from "./types";
