// The templating engine. Each block is assembled from fixed prose + sentences
// that are included ONLY when their driving answer is filled — so there are
// never empty brackets, and a whole block is omitted when its driver is absent.
// The Lead always renders (but its Layout / density bullets are conditional).

import { SCAN_LINE_DEFAULT, type Answers, type UrgentCriteria } from "./answers";

export type Block = { id: string; title: string; text: string };

// ---- slot derivations (verbatim phrasings from the spec) -------------------

function deviceLayout(device?: string): string | undefined {
  switch (device) {
    case "Desktop workstation":
    case "Mounted tablet (landscape)":
      return "desktop, so a left nav rail + top status bar + main roster column, with room for a right-side detail pane";
    case "Personal handheld (portrait)":
      return "mobile single column: sticky top status bar, stacked zones, bottom nav";
    case "Shared wall display":
      return "a large glanceable display: oversized type, needs-attention cluster as the primary surface, reduced per-resident detail, mask PII until someone authenticates";
    case "Mixed/responsive":
      return "responsive: define the priority model once, default to desktop, note mobile collapses to a single column";
    default:
      return undefined;
  }
}

function densityLine(count?: string): string | undefined {
  switch (count) {
    case "~8-12":
      return "Use rich resident cards for the whole roster; reuse the existing row.";
    case "~15-25":
      return "Compact rows for the roster, a richer card variant only in the needs-attention cluster (same component, two densities).";
    case "25+":
      return "Compact rows for the roster (mandatory at this volume); the needs-attention cluster is the primary working surface since most of the roster is below the fold.";
    default:
      return undefined;
  }
}

function photoLine(photo?: string): string | undefined {
  switch (photo) {
    case "Reliable from EHR":
      return "Show a small avatar.";
    case "Unreliable, drop from roster":
      return "Do NOT show a photo in the roster (it's an unreliable field, often empty), keep it in the patient detail view only.";
    case "Unknown":
      return "Treat photo as optional: render an avatar only if present, never reserve prominent space for it.";
    default:
      return undefined;
  }
}

function urgentList(uc: UrgentCriteria): string {
  const other = uc.other.trim();
  return [...uc.selected, ...(other ? [other] : [])].join(", ");
}

function detailPhrase(detailLayout?: string): string | null {
  switch (detailLayout) {
    case "Right-side pane (desktop)":
      return "a right-side pane";
    case "Separate screen":
      return "a separate screen";
    default:
      return null; // "Skip" or unset
  }
}

function clockInPhrasing(rel?: string): string | undefined {
  switch (rel) {
    case "Same action as sign-in":
      return "clocking in IS the sign-in action; signing in starts the shift.";
    case "Separate from sign-in":
      return "clock-in is a separate action from sign-in.";
    case "Unsure":
      return "treat clock-in as a distinct action for now, easy to merge with sign-in later.";
    default:
      return undefined;
  }
}

function clockInLocation(gate?: string): string | undefined {
  if (!gate) return undefined;
  return gate === "Can review assignment before clocking in"
    ? "the global nav, so it's reachable but not a barrier to reviewing the assignment"
    : "the global nav, and gate the shift start on it";
}

function assignmentConfirmPhrasing(confirm?: string): string | undefined {
  switch (confirm) {
    case "Confirm is a real gate":
      return "Confirmation is a real gate, the shift can't start until the CNA confirms.";
    case "Confirm is a formality":
      return "Confirmation is a light formality, don't make it a heavy interruption.";
    case "Unsure":
      return "Treat confirmation as a simple explicit step.";
    default:
      return undefined;
  }
}

function multiDevicePhrasing(md?: string): string | undefined {
  switch (md) {
    case "One device per shift":
      return "Assume one device per shift; no cross-device session syncing needed.";
    case "Caregiver can be signed in on multiple devices":
      return "Support a caregiver signed in on multiple devices; the sync/session model and the offline queue must reconcile across devices (note this for the backend).";
    case "Unsure":
      return "Leave multi-device open for now; don't assume single-device.";
    default:
      return undefined;
  }
}

function mistakeCorrectionPhrasing(correction?: string): string | undefined {
  switch (correction) {
    case "CNA self-edits":
      return "the CNA can edit a committed entry directly.";
    case "Amendment/correction that preserves the original":
      return "edits create an amendment that preserves the original entry (it's a medical record), both visible and attributed, not a silent overwrite.";
    case "Escalates to a nurse":
      return "the CNA flags it and correction is handled by a nurse, not edited in place.";
    case "Unsure":
      return "leave correction handling open; just make entries non-destructively editable for now.";
    default:
      return undefined;
  }
}

// Follow-up 1's sort instruction. mostDangerous (if filled) leads so the single
// most dangerous miss surfaces first, then sortPriority; either may stand alone.
function sortInstruction(a: Answers): string | undefined {
  const danger = a.mostDangerous.trim();
  const sort = a.sortPriority.trim();
  if (danger && sort) return `Sort the cluster so ${danger} surfaces first, then ${sort}.`;
  if (danger) return `Sort the cluster so ${danger} surfaces first.`;
  if (sort) return `Sort the cluster ${sort}.`;
  return undefined;
}

// Follow-up 4 addendum: how a committed entry gets corrected (+ optional detail).
function mistakeCorrectionLine(a: Answers): string | undefined {
  const phrasing = mistakeCorrectionPhrasing(a.mistakeCorrection);
  const detail = a.mistakeCorrectionDetail.trim();
  if (!phrasing && !detail) return undefined;
  return sentences("Correcting a committed entry:", phrasing, detail || false);
}

// Join sentence segments with single spaces, dropping any empty ones.
function sentences(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

// ---- blocks ----------------------------------------------------------------

function lead(a: Answers): Block {
  const layout = deviceLayout(a.device);
  const density = densityLine(a.count);
  const bullets = [
    layout && `- Layout: ${layout}${a.deviceDetail.trim() ? `. ${a.deviceDetail.trim()}` : ""}`,
    "- A sticky status header carrying shift-long status (facility, clock-in, sync).",
    "- A pinned 'Needs attention' cluster that does NOT scroll, this is the triage surface.",
    "- Below it, the full assignment roster, scrollable.",
    density && `- ${density}${a.countDetail.trim() ? ` ${a.countDetail.trim()}` : ""}`,
  ].filter(Boolean) as string[];

  const text = [
    "This monorepo has a Storybook and a running patient census list. I'm building a new 'CNA Assignment View': the screen a CNA sees at shift start to review their resident assignment and triage who needs attention first. Reuse existing components and design tokens from the census list and Storybook. Do NOT create new components if an existing one fits, ask me before creating anything new.",
    "Governing principle (drives every layout call): this screen has ONE primary job, get the CNA from 'just walked in' to 'I know who I'm responsible for and who needs attention first,' fast. Hierarchy is the point, and hierarchy is bias made explicit: make the single most important thing the biggest and easiest to catch while scrolling, and actively de-emphasize or hide lower-priority data rather than fitting everything in.",
    "Build the SHELL only for now, we'll iterate:\n" +
      bullets.join("\n") +
      "\nSeed with the existing patient data and placeholder grouping so I can see structure. Don't wire real sort logic yet. Show me the result.",
  ].join("\n\n");

  return { id: "lead", title: "Lead · shell — always run first", text };
}

function clockIn(a: Answers): Block | null {
  const phrasing = clockInPhrasing(a.clockInRelationship);
  const location = clockInLocation(a.clockInGate);
  if (!phrasing && !location) return null;
  const detail = a.clockInDetail.trim();
  const text = sentences(
    "Clock-in flow:",
    phrasing,
    detail || false,
    location && `Reflect this in the shell, the time clock lives in ${location}.`,
  );
  return { id: "clockIn", title: "Clock-in", text };
}

function assignmentSelection(a: Answers): Block | null {
  if (!a.includeAssignmentSelection) return null;
  const text = sentences(
    "Add an Assignment Selection step that precedes the assignment view: the CNA reviews their pre-assigned resident list and confirms before the shift starts.",
    a.assignmentSource.trim() && `Source/ownership: ${a.assignmentSource.trim()}.`,
    a.assignmentAdjust.trim() && `Adjustments: ${a.assignmentAdjust.trim()}.`,
    assignmentConfirmPhrasing(a.assignmentConfirm),
    "Keep it lightweight, it's a review-and-confirm gate, not a heavy editor. Reuse the roster row component so the selection list and the assignment view stay visually consistent.",
  );
  return { id: "assignmentSelection", title: "Assignment Selection", text };
}

function fu1(a: Answers): Block | null {
  const list = urgentList(a.urgentCriteria);
  const sort = sortInstruction(a);
  if (!list && !sort) return null;
  const text = sentences(
    "Make the 'Needs attention' cluster real.",
    list && `A resident belongs there if they have any of: ${list}.`,
    sort,
    "The roster sorts by the same priority descending, then room, default sort is triage, NOT room number, because the first 10 minutes is prioritization. Keep the grouping/priority criteria in one place so it's trivial to change.",
  );
  return { id: "fu1", title: "Needs-attention / triage", text };
}

function fu2(a: Answers): Block | null {
  const scan = a.scanLine.trim();
  if (!a.photo && !scan) return null;
  const text = sentences(
    `On each resident, always show ${scan || SCAN_LINE_DEFAULT} as the primary scan line, then age/sex and task progress as secondary.`,
    photoLine(a.photo),
    a.photoDetail.trim() || false,
    "Render risk flags, admit/discharge, and active alerts ONLY when present, as chips using icon + text + color, never color alone (accessibility, glove-glance). Reuse the existing chip/badge component.",
  );
  return { id: "fu2", title: "Resident card · fields + photo", text };
}

function fu3(a: Answers): Block | null {
  if (a.sync !== "Needed") return null;
  const text = sentences(
    "Add an ambient sync indicator to the top bar: a calm chip showing online/synced vs offline with a queued count. Not a modal, never blocks.",
    a.syncDetail.trim() || false,
    "For any write, show per-entry sync state: optimistic (appears immediately but visibly pending), confirmed (resolves to a quiet saved state), and failed (loud and PERSISTENT, never a vanishing toast, since a silently-failed vital is a safety problem).",
    multiDevicePhrasing(a.multiDevice),
  );
  return { id: "fu3", title: "Connectivity / sync", text };
}

function fu4(a: Answers): Block | null {
  const phrase = detailPhrase(a.detailLayout);
  if (!phrase) return null;
  const text = sentences(
    `Clicking a resident opens their detail (${phrase}) with carryover from last shift and quick actions for Vitals, Meals, ADLs.`,
    "Keep documentation OFF the overview, the overview decides WHO, the detail documents WHAT. Inputs are structured only (numeric/predefined, no freeform). Do NOT pre-fill measured values with defaults, show the last reading as reference next to an empty field, never inside it. Flag implausible or unchanged values rather than adding a blanket 'did you measure this?' confirm gate.",
    a.detailLayoutDetail.trim() || false,
    mistakeCorrectionLine(a),
  );
  return { id: "fu4", title: "Patient detail + documentation", text };
}

function fu5(a: Answers): Block | null {
  if (a.batchDoc !== "Yes, across whole assignment") return null;
  const text = sentences(
    "Support documenting one task type across the whole assignment in a single pass (e.g. meal intake for every resident), in addition to per-resident entry.",
    a.batchNote.trim() || false,
  );
  return { id: "fu5", title: "Batch documentation", text };
}

function notes(a: Answers): Block | null {
  const ft = a.freeText.trim();
  if (!ft) return null;
  return { id: "notes", title: "Notes · session context", text: `Additional context from the session: ${ft}` };
}

// Build sequence: the shell first (the container must exist before refinements),
// then the flow order — clock-in, the opt-in assignment step, triage, card
// fields, patient detail, batch, and connectivity last. Notes stays a separate
// trailing block. The output pane numbers blocks by this order.
export function buildBlocks(a: Answers): Block[] {
  return [
    lead(a),
    clockIn(a),
    assignmentSelection(a),
    fu1(a),
    fu2(a),
    fu4(a),
    fu5(a),
    fu3(a),
    notes(a),
  ].filter((b): b is Block => b !== null);
}
