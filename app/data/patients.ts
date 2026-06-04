// data/patients.ts — resident roster for the CNA Assignment View.
//
// Fixture for CNA A. Reyes — 1 North, Day Shift. There is no global "status"
// (Critical/Stable) — residents are simply people who carry flags or don't.
// Flags are shown as hover icons; their triage priority lives in `lib/triage.ts`
// and task urgency in `residentSignals.ts`.

/** The kinds of flag a resident can carry. Each maps to one hover icon. */
export type FlagKind =
  | "Fall Risk"
  | "Aspiration"
  | "Wound Care"
  | "Elopement"
  | "Time-Sensitive";

/** A flag is an icon; `detail` is the hover text (e.g. a time-sensitive task). */
export type ResidentFlag = { kind: FlagKind; detail?: string };

export type Patient = {
  id: number;
  room: string;
  name: string;
  age: number;
  sex: "F" | "M";
  diagnosis: string;
  /** Stay context, e.g. "Day 4", "long-term", "monitored". May be empty. */
  stay: string;
  /** Safety / care flags surfaced as hover icons. */
  flags: ResidentFlag[];
  /** Relative time of the last documentation, e.g. "8 min ago". */
  updated: string;
};

export const PATIENTS: Patient[] = [
  { id: 1, room: "101A", name: "Dorothy Hale",  age: 84, sex: "F", diagnosis: "Hip fracture post-op", stay: "Day 4",     flags: [{ kind: "Fall Risk" }, { kind: "Aspiration" }],                                  updated: "8 min ago"  },
  { id: 2, room: "103B", name: "Walter Briggs", age: 79, sex: "M", diagnosis: "Stage 3 wound",        stay: "Day 12",    flags: [{ kind: "Wound Care" }],                                                         updated: "21 min ago" },
  { id: 3, room: "107A", name: "Margaret Cho",  age: 88, sex: "F", diagnosis: "Dementia",             stay: "long-term", flags: [{ kind: "Elopement" }, { kind: "Time-Sensitive", detail: "Dressed by 09:00" }], updated: "1 hr ago"   },
  { id: 4, room: "110A", name: "James Okafor",  age: 72, sex: "M", diagnosis: "COPD",                 stay: "stable",    flags: [],                                                                              updated: "12 min ago" },
  { id: 5, room: "112B", name: "Rosa Marin",    age: 90, sex: "F", diagnosis: "CHF",                  stay: "monitored", flags: [{ kind: "Fall Risk" }, { kind: "Time-Sensitive", detail: "Cardiology · 14:00" }], updated: "30 min ago" },
  { id: 6, room: "115A", name: "Henry Talbot",  age: 81, sex: "M", diagnosis: "Post-stroke rehab",    stay: "",          flags: [{ kind: "Time-Sensitive", detail: "PT eval · 11:00" }],                          updated: "9 min ago"  },
  { id: 7, room: "118A", name: "Lucia Ferraro", age: 77, sex: "F", diagnosis: "Diabetes mgmt",        stay: "",          flags: [],                                                                              updated: "40 min ago" },
  { id: 8, room: "120B", name: "Sam Greene",    age: 85, sex: "M", diagnosis: "Hospice comfort",      stay: "",          flags: [],                                                                              updated: "5 min ago"  },
];
