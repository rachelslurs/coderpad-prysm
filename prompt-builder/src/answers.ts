// The interview answer model + question metadata. The question set, option
// labels, and defaults all live here so they're trivial to tweak in one place.

export type UrgentCriteria = { selected: string[]; other: string };

export type Answers = {
  device?: string;
  deviceDetail: string;
  count?: string;
  countDetail: string;
  photo?: string;
  photoDetail: string;
  sync?: string;
  syncDetail: string;
  detailLayout?: string;
  detailLayoutDetail: string;
  batchDoc?: string;
  batchNote: string;
  urgentCriteria: UrgentCriteria;
  sortPriority: string;
  scanLine: string;
  freeText: string;
};

// Question 6 ships with a sensible default, so the primary scan line is always
// specified (and Follow-up 2 renders from the start).
export const SCAN_LINE_DEFAULT = "room number and full name";

export const DEVICE_OPTIONS: string[] = [
  "Desktop workstation",
  "Mounted tablet (landscape)",
  "Personal handheld (portrait)",
  "Shared wall display",
  "Mixed/responsive",
];
export const COUNT_OPTIONS: string[] = ["~8-12", "~15-25", "25+"];
export const URGENT_OPTIONS: string[] = [
  "active clinical alert",
  "overnight event (e.g. fall)",
  "admit today",
  "discharge today",
  "unaddressed risk flag",
];
export const PHOTO_OPTIONS: string[] = [
  "Reliable from EHR",
  "Unreliable, drop from roster",
  "Unknown",
];
export const SYNC_OPTIONS: string[] = ["Needed", "Not needed"];
export const DETAIL_LAYOUT_OPTIONS: string[] = [
  "Right-side pane (desktop)",
  "Separate screen",
  "Skip",
];
export const BATCH_DOC_OPTIONS: string[] = [
  "Yes, across whole assignment",
  "No, per-resident only",
  "Unsure",
];

export const DEFAULT_ANSWERS: Answers = {
  device: undefined,
  deviceDetail: "",
  count: undefined,
  countDetail: "",
  photo: undefined,
  photoDetail: "",
  sync: undefined,
  syncDetail: "",
  detailLayout: undefined,
  detailLayoutDetail: "",
  batchDoc: undefined,
  batchNote: "",
  urgentCriteria: { selected: [], other: "" },
  sortPriority: "",
  scanLine: SCAN_LINE_DEFAULT,
  freeText: "",
};

// Like DEFAULT_ANSWERS but fully empty — used when "Clear"-ing one question
// (scanLine clears to "" so it leaves the answered set). Reset, by contrast,
// restores DEFAULT_ANSWERS (scanLine default back).
export const CLEARED: Answers = { ...DEFAULT_ANSWERS, scanLine: "" };

// Optional free-text addendum attached to a single-select, for nuance the
// predefined options don't capture. Surfaces in that question's output block.
export type DetailField =
  | "deviceDetail"
  | "countDetail"
  | "photoDetail"
  | "syncDetail"
  | "detailLayoutDetail"
  | "batchNote";

export type QuestionKind = "single" | "multi" | "text";

export type Question = {
  id: keyof Answers;
  n: number;
  label: string;
  hint?: string;
  kind: QuestionKind;
  control?: "segmented" | "select";
  options?: string[];
  detailField?: DetailField;
  detailLabel?: string;
};

// Q1–Q9 (the structured questions). freeText (Q10) is the always-visible
// catch-all, rendered separately — not part of the question list.
// Every single-select carries an optional detail field as an escape hatch for
// an option we haven't considered.
export const QUESTIONS: Question[] = [
  { id: "device", n: 1, label: "Device", kind: "single", control: "select", options: DEVICE_OPTIONS, hint: "where the CNA uses it", detailField: "deviceDetail", detailLabel: "Anything else about the device? (optional)" },
  { id: "count", n: 2, label: "Roster size", kind: "single", control: "segmented", options: COUNT_OPTIONS, hint: "how many residents", detailField: "countDetail", detailLabel: "Anything else about volume? (optional)" },
  { id: "urgentCriteria", n: 3, label: "Needs-attention criteria", kind: "multi", options: URGENT_OPTIONS, hint: "what flags a resident" },
  { id: "sortPriority", n: 4, label: "Sort priority", kind: "text", hint: "how to rank the cluster" },
  { id: "photo", n: 5, label: "Resident photo", kind: "single", control: "segmented", options: PHOTO_OPTIONS, hint: "photo reliability", detailField: "photoDetail", detailLabel: "Anything else about photos? (optional)" },
  { id: "scanLine", n: 6, label: "Primary scan line", kind: "text", hint: "the primary scan line" },
  { id: "sync", n: 7, label: "Offline sync", kind: "single", control: "segmented", options: SYNC_OPTIONS, hint: "needed?", detailField: "syncDetail", detailLabel: "Sync detail (optional)" },
  { id: "detailLayout", n: 8, label: "Resident detail view", kind: "single", control: "segmented", options: DETAIL_LAYOUT_OPTIONS, hint: "where detail opens", detailField: "detailLayoutDetail", detailLabel: "A different detail approach? (optional)" },
  { id: "batchDoc", n: 9, label: "Batch documentation", kind: "single", control: "segmented", options: BATCH_DOC_OPTIONS, hint: "cross-assignment pass?", detailField: "batchNote", detailLabel: "Batch detail (optional)" },
];

export function isAnswered(q: Question, a: Answers): boolean {
  if (q.kind === "multi") {
    return a.urgentCriteria.selected.length > 0 || a.urgentCriteria.other.trim() !== "";
  }
  const v = a[q.id];
  return typeof v === "string" ? v.trim() !== "" : v != null;
}
