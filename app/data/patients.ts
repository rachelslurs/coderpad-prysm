// data/patients.ts — resident roster for the CNA Assignment View.
//
// Fixture for CNA A. Reyes — 1 North, Day Shift. A resident record carries the
// ADL/care facts a CNA acts on (fall risk, transfer, continence), the signals
// that drive sort order (time-sensitive task, clinical alert), task progress, and
// a freshness stamp. Clinical detail belongs in the nurse experience, not here.

/** Transfer assistance a resident needs — the 2nd fixed care icon. */
export type TransferNeed =
  | "independent"
  | "one-assist"
  | "two-person"
  | "mechanical-lift";

/** Continence state — the 3rd fixed care icon. */
export type Continence = "continent" | "incontinent";

/** A must-happen-by-a-time task (e.g. dressed by 09:00, 14:00 appointment). */
export type TimeSensitive = { label: string; due: string };

export type Patient = {
  id: number;
  room: string;
  name: string;
  age: number;
  sex: "F" | "M";
  diagnosis: string;
  /** Stay context, e.g. "Day 4", "long-term". May be empty. */
  stay: string;
  /** Optional photo; the avatar falls back to initials when absent. */
  photoUrl?: string;

  // --- fixed care attributes (the 3-slot icon row) ---
  fallRisk: boolean;
  /** Elopement / wander risk. */
  wanderer: boolean;
  transfer: TransferNeed;
  continence: Continence;

  // --- sort signals ---
  timeSensitive?: TimeSensitive;

  // --- profile + freshness + progress ---
  /** Care preferences (e.g. "Female care staff only") — informs groupings. */
  preferences?: string[];
  /** Minutes since the last documentation — drives "updated X ago" + staleness. */
  updatedMinAgo: number;
  tasksDone: number;
  tasksTotal: number;
};

/** Active clinical alert that elevates a resident in the sort (don't subdivide). */
export const hasAlert = (p: Patient): boolean => p.fallRisk || p.wanderer;

export const PATIENTS: Patient[] = [
  { id: 1,  room: "101A", name: "Dorothy Hale",   age: 84, sex: "F", photoUrl: "https://i.pravatar.cc/160?img=5", diagnosis: "Hip fracture post-op", stay: "Day 4",     fallRisk: true,  wanderer: false, transfer: "mechanical-lift", continence: "incontinent", updatedMinAgo: 8,  tasksDone: 1, tasksTotal: 6 },
  { id: 2,  room: "103B", name: "Walter Briggs",  age: 79, sex: "M", diagnosis: "Stage 3 wound",        stay: "Day 12",    fallRisk: false, wanderer: false, transfer: "two-person",      continence: "incontinent", updatedMinAgo: 21, tasksDone: 2, tasksTotal: 6 },
  { id: 3,  room: "107A", name: "Margaret Cho",   age: 88, sex: "F", photoUrl: "https://i.pravatar.cc/160?img=45", diagnosis: "Dementia",             stay: "long-term", fallRisk: true,  wanderer: true,  transfer: "two-person",      continence: "incontinent", timeSensitive: { label: "Dressed", due: "09:00" }, preferences: ["Female care staff only"], updatedMinAgo: 60, tasksDone: 0, tasksTotal: 4 },
  { id: 4,  room: "110A", name: "James Okafor",   age: 72, sex: "M", diagnosis: "COPD",                 stay: "stable",    fallRisk: false, wanderer: false, transfer: "independent",     continence: "continent",   updatedMinAgo: 12, tasksDone: 3, tasksTotal: 6 },
  { id: 5,  room: "112B", name: "Rosa Marin",     age: 90, sex: "F", photoUrl: "https://i.pravatar.cc/160?img=32", diagnosis: "CHF",                  stay: "monitored", fallRisk: true,  wanderer: false, transfer: "one-assist",      continence: "continent",   timeSensitive: { label: "Cardiology appt", due: "14:00" }, updatedMinAgo: 30, tasksDone: 4, tasksTotal: 6 },
  { id: 6,  room: "115A", name: "Henry Talbot",   age: 81, sex: "M", photoUrl: "https://i.pravatar.cc/160?img=12", diagnosis: "Post-stroke rehab",    stay: "",          fallRisk: false, wanderer: false, transfer: "one-assist",      continence: "continent",   timeSensitive: { label: "PT eval", due: "11:00" }, updatedMinAgo: 9, tasksDone: 5, tasksTotal: 6 },
  { id: 7,  room: "118A", name: "Lucia Ferraro",  age: 77, sex: "F", diagnosis: "Diabetes mgmt",        stay: "",          fallRisk: false, wanderer: false, transfer: "independent",     continence: "continent",   updatedMinAgo: 95, tasksDone: 2, tasksTotal: 6 },
  { id: 8,  room: "120B", name: "Sam Greene",     age: 85, sex: "M", photoUrl: "https://i.pravatar.cc/160?img=68", diagnosis: "Hospice comfort",      stay: "",          fallRisk: false, wanderer: false, transfer: "one-assist",      continence: "incontinent", updatedMinAgo: 5, tasksDone: 6, tasksTotal: 6 },
  { id: 9,  room: "122A", name: "Pearl Watkins",  age: 91, sex: "F", diagnosis: "Parkinson's",          stay: "long-term", fallRisk: true,  wanderer: false, transfer: "two-person",      continence: "incontinent", preferences: ["Female care staff only"], updatedMinAgo: 45, tasksDone: 1, tasksTotal: 5 },
  { id: 10, room: "124B", name: "Arthur Mensah",  age: 68, sex: "M", diagnosis: "CHF / renal",          stay: "monitored", fallRisk: false, wanderer: false, transfer: "independent",     continence: "continent",   updatedMinAgo: 18, tasksDone: 3, tasksTotal: 5 },
  // --- other 1 North residents (off A. Reyes's assignment; appear in unit-wide batch) ---
  { id: 11, room: "126A", name: "Edith Brennan",  age: 86, sex: "F", photoUrl: "https://i.pravatar.cc/160?img=24", diagnosis: "UTI",          stay: "monitored", fallRisk: true,  wanderer: false, transfer: "one-assist",  continence: "continent",   updatedMinAgo: 22, tasksDone: 2, tasksTotal: 6 },
  { id: 12, room: "128B", name: "Carlos Vega",    age: 74, sex: "M", diagnosis: "Post-op knee",         stay: "Day 2",     fallRisk: false, wanderer: false, transfer: "two-person",  continence: "continent",   updatedMinAgo: 14, tasksDone: 1, tasksTotal: 6 },
  { id: 13, room: "130A", name: "Florence Webb",  age: 89, sex: "F", photoUrl: "https://i.pravatar.cc/160?img=27", diagnosis: "Dementia",     stay: "long-term", fallRisk: false, wanderer: true,  transfer: "two-person",  continence: "incontinent", updatedMinAgo: 70, tasksDone: 0, tasksTotal: 4 },
  { id: 14, room: "132B", name: "Otis Palmer",    age: 81, sex: "M", diagnosis: "COPD",                 stay: "stable",    fallRisk: false, wanderer: false, transfer: "independent", continence: "continent",   updatedMinAgo: 16, tasksDone: 3, tasksTotal: 6 },
  { id: 15, room: "134A", name: "Nadia Hassan",   age: 78, sex: "F", diagnosis: "Diabetes mgmt",        stay: "monitored", fallRisk: false, wanderer: false, transfer: "one-assist",  continence: "continent",   updatedMinAgo: 33, tasksDone: 2, tasksTotal: 6 },
  { id: 16, room: "136B", name: "Leon Carter",    age: 83, sex: "M", photoUrl: "https://i.pravatar.cc/160?img=51", diagnosis: "CHF",          stay: "monitored", fallRisk: true,  wanderer: false, transfer: "one-assist",  continence: "incontinent", updatedMinAgo: 27, tasksDone: 4, tasksTotal: 6 },
];
