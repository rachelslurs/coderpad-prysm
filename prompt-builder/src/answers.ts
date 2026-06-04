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
  // Stage 1 — sign-in / clock-in
  clockInRelationship?: string;
  clockInGate?: string;
  clockInDetail: string;
  // Stage 2 — assignment selection (opt-in; toggle gates the sub-questions)
  includeAssignmentSelection: boolean;
  assignmentSource: string;
  assignmentAdjust: string;
  assignmentConfirm?: string;
  // Stage 3 — assignment view
  mostDangerous: string;
  // Stage 4 — patient view / documentation
  mistakeCorrection?: string;
  mistakeCorrectionDetail: string;
  // Cross-cutting
  multiDevice?: string;
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
export const CLOCK_IN_RELATIONSHIP_OPTIONS: string[] = [
  "Same action as sign-in",
  "Separate from sign-in",
  "Unsure",
];
export const CLOCK_IN_GATE_OPTIONS: string[] = [
  "Clock-in starts the shift (must clock in before reviewing)",
  "Can review assignment before clocking in",
  "Unsure",
];
export const ASSIGNMENT_CONFIRM_OPTIONS: string[] = [
  "Confirm is a real gate",
  "Confirm is a formality",
  "Unsure",
];
export const MULTI_DEVICE_OPTIONS: string[] = [
  "One device per shift",
  "Caregiver can be signed in on multiple devices",
  "Unsure",
];
export const MISTAKE_CORRECTION_OPTIONS: string[] = [
  "CNA self-edits",
  "Amendment/correction that preserves the original",
  "Escalates to a nurse",
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
  clockInRelationship: undefined,
  clockInGate: undefined,
  clockInDetail: "",
  includeAssignmentSelection: false,
  assignmentSource: "",
  assignmentAdjust: "",
  assignmentConfirm: undefined,
  mostDangerous: "",
  mistakeCorrection: undefined,
  mistakeCorrectionDetail: "",
  multiDevice: undefined,
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
  | "batchNote"
  | "mistakeCorrectionDetail";

export type QuestionKind = "single" | "multi" | "text" | "toggle";

// Form stages — the question list mirrors the interview flow. Headings render in
// this fixed order; the "answered first" toggle only reorders questions WITHIN a
// stage, so the stages always read in conversation order.
export const STAGE_CONTEXT = "Context";
export const STAGE_SIGN_IN = "Stage 1 · Sign-in / clock-in";
export const STAGE_ASSIGNMENT = "Stage 2 · Assignment Selection";
export const STAGE_VIEW = "Stage 3 · Assignment View";
export const STAGE_PATIENT = "Stage 4 · Patient view / documentation";
export const STAGE_CROSS = "Cross-cutting";

export type Stage = { title: string; hint?: string };
export const STAGES: Stage[] = [
  { title: STAGE_CONTEXT, hint: "ask first" },
  { title: STAGE_SIGN_IN },
  { title: STAGE_ASSIGNMENT, hint: "opt-in · collapsed by default" },
  { title: STAGE_VIEW, hint: "the core" },
  { title: STAGE_PATIENT },
  { title: STAGE_CROSS, hint: "raise where relevant" },
];

export type Question = {
  id: keyof Answers;
  n: number;
  group: string;
  label: string;
  hint?: string;
  kind: QuestionKind;
  control?: "segmented" | "select";
  options?: string[];
  detailField?: DetailField;
  detailLabel?: string;
  // When present, the question only shows (and only counts) while this returns
  // true — used to reveal the Assignment Selection sub-questions on opt-in.
  showWhen?: (a: Answers) => boolean;
};

// The structured questions, grouped into stages that mirror the interview flow.
// freeText (the catch-all) is always-visible and rendered separately — not part
// of this list. Every single-select carries an optional detail field as an
// escape hatch for an option we haven't considered. `n` traces back to the prep
// doc's question numbers; the array order is what the form renders.
const includeAssignment = (a: Answers): boolean => a.includeAssignmentSelection;

export const QUESTIONS: Question[] = [
  // Context — ask first
  { id: "device", n: 1, group: STAGE_CONTEXT, label: "Device", kind: "single", control: "select", options: DEVICE_OPTIONS, hint: "where the CNA uses it", detailField: "deviceDetail", detailLabel: "Anything else about the device? (optional)" },

  // Stage 1 — Sign-in / clock-in
  { id: "clockInRelationship", n: 11, group: STAGE_SIGN_IN, label: "Clock-in vs sign-in", kind: "single", control: "select", options: CLOCK_IN_RELATIONSHIP_OPTIONS, hint: "same action or separate?" },
  { id: "clockInGate", n: 12, group: STAGE_SIGN_IN, label: "Clock-in gating", kind: "single", control: "select", options: CLOCK_IN_GATE_OPTIONS, hint: "does it gate the shift?" },
  { id: "clockInDetail", n: 13, group: STAGE_SIGN_IN, label: "Clock-in / timekeeping detail", kind: "text", hint: "anything else about clock-in/timekeeping" },

  // Stage 2 — Assignment Selection (opt-in; the toggle reveals the rest)
  { id: "includeAssignmentSelection", n: 14, group: STAGE_ASSIGNMENT, label: "Include Assignment Selection?", kind: "toggle", hint: "opt-in pre-shift confirm step" },
  { id: "assignmentSource", n: 14, group: STAGE_ASSIGNMENT, label: "Who pre-assigns the list?", kind: "text", hint: "who pre-assigns the list and where it comes from", showWhen: includeAssignment },
  { id: "assignmentAdjust", n: 14, group: STAGE_ASSIGNMENT, label: "Can the CNA adjust it?", kind: "text", hint: "swap/flag/reassign residents, and who approves", showWhen: includeAssignment },
  { id: "assignmentConfirm", n: 14, group: STAGE_ASSIGNMENT, label: "Is confirm a gate?", kind: "single", control: "select", options: ASSIGNMENT_CONFIRM_OPTIONS, hint: "real gate or formality?", showWhen: includeAssignment },

  // Stage 3 — Assignment View (the core)
  { id: "count", n: 2, group: STAGE_VIEW, label: "Roster size", kind: "single", control: "segmented", options: COUNT_OPTIONS, hint: "how many residents", detailField: "countDetail", detailLabel: "Anything else about volume? (optional)" },
  { id: "photo", n: 5, group: STAGE_VIEW, label: "Resident photo", kind: "single", control: "segmented", options: PHOTO_OPTIONS, hint: "photo reliability", detailField: "photoDetail", detailLabel: "Anything else about photos? (optional)" },
  { id: "scanLine", n: 6, group: STAGE_VIEW, label: "Primary scan line", kind: "text", hint: "the primary scan line" },
  { id: "urgentCriteria", n: 3, group: STAGE_VIEW, label: "Needs-attention criteria", kind: "multi", options: URGENT_OPTIONS, hint: "what flags a resident" },
  { id: "mostDangerous", n: 15, group: STAGE_VIEW, label: "Most dangerous to miss", kind: "text", hint: "the single most dangerous thing to miss in the first 10 minutes" },
  { id: "sortPriority", n: 4, group: STAGE_VIEW, label: "Sort priority", kind: "text", hint: "how to rank the cluster" },

  // Stage 4 — Patient view / documentation
  { id: "detailLayout", n: 8, group: STAGE_PATIENT, label: "Resident detail view", kind: "single", control: "segmented", options: DETAIL_LAYOUT_OPTIONS, hint: "where detail opens", detailField: "detailLayoutDetail", detailLabel: "A different detail approach? (optional)" },
  { id: "mistakeCorrection", n: 17, group: STAGE_PATIENT, label: "Correcting a committed entry", kind: "single", control: "select", options: MISTAKE_CORRECTION_OPTIONS, hint: "how mistakes get fixed", detailField: "mistakeCorrectionDetail", detailLabel: "Anything else about corrections? (optional)" },
  { id: "batchDoc", n: 9, group: STAGE_PATIENT, label: "Batch documentation", kind: "single", control: "segmented", options: BATCH_DOC_OPTIONS, hint: "cross-assignment pass?", detailField: "batchNote", detailLabel: "Batch detail (optional)" },

  // Cross-cutting — raise where relevant
  { id: "sync", n: 7, group: STAGE_CROSS, label: "Offline sync", kind: "single", control: "segmented", options: SYNC_OPTIONS, hint: "needed?", detailField: "syncDetail", detailLabel: "Sync detail (optional)" },
  { id: "multiDevice", n: 16, group: STAGE_CROSS, label: "Multi-device", kind: "single", control: "select", options: MULTI_DEVICE_OPTIONS, hint: "one device or many?" },
];

export function isAnswered(q: Question, a: Answers): boolean {
  if (q.kind === "multi") {
    return a.urgentCriteria.selected.length > 0 || a.urgentCriteria.other.trim() !== "";
  }
  if (q.kind === "toggle") {
    return Boolean(a[q.id]);
  }
  const v = a[q.id];
  return typeof v === "string" ? v.trim() !== "" : v != null;
}

// A question participates in the form only when its showWhen guard (if any)
// passes — hidden questions are also excluded from the answered count.
export function isVisible(q: Question, a: Answers): boolean {
  return !q.showWhen || q.showWhen(a);
}
