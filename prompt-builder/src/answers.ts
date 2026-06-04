// The interview answer model + question metadata. The question set, option
// labels, and defaults all live here so they're trivial to tweak in one place.

export type UrgentCriteria = { selected: string[]; other: string };

export type Answers = {
  device?: string;
  count?: string;
  photo?: string;
  sync?: string;
  syncDetail: string;
  detailLayout?: string;
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
  "Separate screen (mobile)",
  "Skip",
];
export const BATCH_DOC_OPTIONS: string[] = [
  "Yes, across whole assignment",
  "No, per-resident only",
  "Unsure",
];

export const DEFAULT_ANSWERS: Answers = {
  device: undefined,
  count: undefined,
  photo: undefined,
  sync: undefined,
  syncDetail: "",
  detailLayout: undefined,
  batchDoc: undefined,
  batchNote: "",
  urgentCriteria: { selected: [], other: "" },
  sortPriority: "",
  scanLine: SCAN_LINE_DEFAULT,
  freeText: "",
};

// Like DEFAULT_ANSWERS but fully empty — used when "Clear"-ing one question
// (scanLine clears to "" so it leaves the Answered group). Reset, by contrast,
// restores DEFAULT_ANSWERS (scanLine default back).
export const CLEARED: Answers = { ...DEFAULT_ANSWERS, scanLine: "" };

export type QuestionKind = "single" | "multi" | "text";

export type Question = {
  id: keyof Answers;
  n: number;
  label: string;
  hint?: string;
  kind: QuestionKind;
  control?: "segmented" | "select";
  options?: string[];
  detailField?: "syncDetail" | "batchNote";
  detailLabel?: string;
};

// Q1–Q9 (the structured questions). freeText (Q10) is the always-visible
// catch-all, rendered separately — not part of the answered/unanswered lists.
export const QUESTIONS: Question[] = [
  { id: "device", n: 1, label: "Device", kind: "single", control: "select", options: DEVICE_OPTIONS, hint: "where the CNA uses it" },
  { id: "count", n: 2, label: "Roster size", kind: "single", control: "segmented", options: COUNT_OPTIONS, hint: "how many residents" },
  { id: "urgentCriteria", n: 3, label: "Needs-attention criteria", kind: "multi", options: URGENT_OPTIONS, hint: "what flags a resident" },
  { id: "sortPriority", n: 4, label: "Sort priority", kind: "text", hint: "how to rank the cluster" },
  { id: "photo", n: 5, label: "Resident photo", kind: "single", control: "segmented", options: PHOTO_OPTIONS, hint: "photo reliability" },
  { id: "scanLine", n: 6, label: "Primary scan line", kind: "text", hint: "the primary scan line" },
  { id: "sync", n: 7, label: "Offline sync", kind: "single", control: "segmented", options: SYNC_OPTIONS, hint: "needed?", detailField: "syncDetail", detailLabel: "Sync detail (optional)" },
  { id: "detailLayout", n: 8, label: "Resident detail view", kind: "single", control: "segmented", options: DETAIL_LAYOUT_OPTIONS, hint: "where detail opens" },
  { id: "batchDoc", n: 9, label: "Batch documentation", kind: "single", control: "segmented", options: BATCH_DOC_OPTIONS, hint: "cross-assignment pass?", detailField: "batchNote", detailLabel: "Batch detail (optional)" },
];

export function isAnswered(q: Question, a: Answers): boolean {
  if (q.kind === "multi") {
    return a.urgentCriteria.selected.length > 0 || a.urgentCriteria.other.trim() !== "";
  }
  const v = a[q.id];
  return typeof v === "string" ? v.trim() !== "" : v != null;
}
