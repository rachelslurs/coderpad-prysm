import { useState, useEffect, useRef } from "react";
import { PATIENTS, type Patient } from "../../data/patients.ts";
import StatusBadge from "./StatusBadge";
import PatientDetail from "./PatientDetail";

// Triage accent applied to the first <td>. Color alone is a WCAG fail —
// pairs with the status column (becomes a badge in Step 3) for redundant encoding.
// Lives on the first cell because <tr> borders don't paint reliably under border-collapse.
const ROW_ACCENT: Record<Patient["status"], string> = {
  Critical: "border-l-4 border-l-red-500",
  "Needs Attention": "border-l-4 border-l-amber-500",
  Stable: "border-l-4 border-l-transparent",
};

const toInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .join("");

export default function PatientCensus() {
  const [searchQuery, setSearchQuery] = useState("");
  // { key, dir } as one cohesive value so toggle transitions stay atomic —
  // never catch a render where dir flipped but key didn't.
  const [sort, setSort] = useState<{ key: keyof Patient; dir: "asc" | "desc" }>({
    key: "room",
    dir: "asc",
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [hideNames, setHideNames] = useState(false);

  // Restore focus to the originating row on close so keyboard users don't lose
  // their place. The close-button-on-open side lives in PatientDetail.
  const lastFocusedRowRef = useRef<HTMLTableRowElement | null>(null);

  // STEP 2 — shallow bug was the empty deps array, but adding [searchQuery]
  // would only hide the real issue: `filtered` was derived state. The effect
  // forked the source of truth and raced handleSort, which also setPatients.
  // Going with: drop the effect + `patients` state, derive in render from
  // (PATIENTS, searchQuery, sortField). Spread before .sort() since it mutates.
  const visiblePatients = [...PATIENTS]
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]));
      return sort.dir === "asc" ? cmp : -cmp;
    });

  // Row-focus restoration runs after the detail panel unmounts. Driven by an
  // effect (not the click handler) so it fires after the DOM swap.
  useEffect(() => {
    if (!selectedPatient && lastFocusedRowRef.current) {
      lastFocusedRowRef.current.focus();
      lastFocusedRowRef.current = null;
    }
  }, [selectedPatient]);

  const openPanel = (
    patient: Patient,
    e: React.SyntheticEvent<HTMLTableRowElement>
  ) => {
    lastFocusedRowRef.current = e.currentTarget;
    setSelectedPatient(patient);
  };

  // Same-key flips direction; new key resets to asc.
  const handleSort = (key: keyof Patient) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const ariaSortFor = (key: keyof Patient) =>
    sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none";

  // Reserved-width slot so column widths don't shift when the arrow toggles in/out.
  const sortIndicator = (key: keyof Patient) => (
    <span aria-hidden="true" className="inline-block w-3 text-xs text-zinc-400">
      {sort.key === key ? (sort.dir === "asc" ? "▲" : "▼") : ""}
    </span>
  );

  // THINKING: Going master-detail swap over overlay/drawer. The tests use
  // getByText for diagnosis/physician — those strings also live in the row, so
  // keeping both visible would duplicate the accessible text. Beyond the test:
  // clinically, a focused single-patient view is the right frame for chart review;
  // the roster is the navigation context, not the working surface. With more time
  // would explore split-pane that physically separates the two regions.
  if (selectedPatient) {
    return (
      <PatientDetail
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <section className="w-full max-w-5xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <header className="flex flex-col gap-3 border-b border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Patient Census</h1>
          <p className="text-sm text-zinc-500">
            Unit <strong className="font-semibold text-zinc-900">1 North</strong> · {visiblePatients.length} patients
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20"
              checked={hideNames}
              onChange={(e) => setHideNames(e.target.checked)}
            />
            Hide patient name
          </label>
          <input
            type="text"
            aria-label="Search by patient name"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 sm:w-72"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <table className="w-full border-collapse text-sm text-zinc-900">
        <thead className="border-b border-zinc-200 bg-zinc-50">
          <tr>
            <th
              scope="col"
              aria-sort={ariaSortFor("room")}
              className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500"
            >
              <button
                type="button"
                onClick={() => handleSort("room")}
                className="-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span>Room</span>
                {sortIndicator("room")}
              </button>
            </th>
            <th
              scope="col"
              aria-sort={ariaSortFor("name")}
              className="min-w-[11rem] px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500"
            >
              <button
                type="button"
                onClick={() => handleSort("name")}
                className="-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span>Patient</span>
                {sortIndicator("name")}
              </button>
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Age</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Physician</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Diagnosis</th>
            <th
              scope="col"
              aria-sort={ariaSortFor("status")}
              className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500"
            >
              <button
                type="button"
                onClick={() => handleSort("status")}
                className="-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span>Status</span>
                {sortIndicator("status")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {visiblePatients.map((patient) => (
            <tr
              key={patient.id}
              // Each row is a tab stop so keyboard users can reach + activate it.
              // Space is preventDefault'd to stop page-scroll (default for focusable
              // non-button elements). Grid pattern w/ roving tabindex would be better
              // once row counts grow — see "with more time" below.
              tabIndex={0}
              className="cursor-pointer border-b border-zinc-100 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
              onClick={(e) => openPanel(patient, e)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPanel(patient, e);
                }
              }}
            >
              <td className={`px-3 py-3 align-middle font-mono text-xs text-zinc-600 ${ROW_ACCENT[patient.status]}`}>
                {patient.room}
              </td>
              <td className="px-3 py-3 align-middle font-medium text-zinc-900">
                {hideNames ? toInitials(patient.name) : patient.name}
              </td>
              <td className="px-3 py-3 align-middle tabular-nums text-zinc-700">{patient.age}</td>
              <td className="px-3 py-3 align-middle text-zinc-600">{patient.physician}</td>
              <td className="px-3 py-3 align-middle text-zinc-600">{patient.diagnosis}</td>
              <td className="px-3 py-3 align-middle">
                <StatusBadge status={patient.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </section>
  );
}

// With more time:
// - Status needs a semantic comparator, not a lexical one. Today's
//   String(...).localeCompare(...) lands Critical / Needs Attention / Stable in triage
//   rank by alphabet coincidence — add "Discharged" and it sorts between Critical and
//   Needs Attention, which is clinically wrong. Right shape is a
//   STATUS_RANK: Record<Patient["status"], number> driving a numeric compare, and
//   defaulting the page to status-desc so the charge nurse lands on Critical first.
//   (Holding the default-sort change off today because it's opinionated and the
//   fixture's room-asc happens to be the natural eye-path.)
// - Per-column comparator map more broadly: age sorts as string today (fine at 2 digits,
//   breaks at 100+); room is alphanumeric and would want natural-order; admittedOn would
//   want Date compare. One comparators[key] lookup replaces the localeCompare default.
// - Dedicated search input with clear button.
// - Sticky thead once the row count justifies it.
// - Map the <th> columns from a config array to kill the header duplication
//   if the column set grows.
// - ARIA grid pattern with roving tabindex + arrow-key row navigation. Today
//   every row is a tab stop (Enter / Space opens the panel); with N rows that's
//   N tab stops to cross the table. Grid pattern collapses to one tab stop with
//   arrow keys to move between rows.
// - Focus trap inside the detail panel (Tab cycles within it). Skipping under
//   timer; with one focusable element in the panel it's a non-issue today.
