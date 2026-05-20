import { useState, useEffect, useRef } from "react";
import { PATIENTS, type Patient } from "../../data/patients.ts";
import StatusBadge from "./StatusBadge";

// Triage accent applied to the first <td>. Color alone is a WCAG fail —
// pairs with the status column (becomes a badge in Step 3) for redundant encoding.
// Lives on the first cell because <tr> borders don't paint reliably under border-collapse.
const ROW_ACCENT: Record<Patient["status"], string> = {
  Critical: "border-l-4 border-l-red-500",
  "Needs Attention": "border-l-4 border-l-amber-500",
  Stable: "border-l-4 border-l-transparent",
};

// Manual split — new Date("YYYY-MM-DD") parses as UTC midnight and drifts a day
// west of GMT. Locale formatter on a local-constructed date is correct.
const parseAdmitted = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatAdmitted = (iso: string) =>
  parseAdmitted(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// "Day N" derived from today — clinically the scan cue ("Day 4" vs "Day 60").
// Fixture admittedOn dates are 2024 so numbers read large here; the pattern is
// the cue, not the magnitude. Would seed fixture from now-N days in prod.
const daysSinceAdmitted = (iso: string) => {
  const admitted = parseAdmitted(iso);
  admitted.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today.getTime() - admitted.getTime()) / 86_400_000));
};

// Hero tint mirrors StatusBadge / ROW_ACCENT — same palette the row already
// uses, so urgency carries through into the detail view. Redundant encoding
// (status word + badge color + tinted hero) wins more on scan than minimalism.
const DIAGNOSIS_TINT: Record<Patient["status"], string> = {
  Critical: "bg-red-50 ring-red-600/20",
  "Needs Attention": "bg-amber-50 ring-amber-600/20",
  Stable: "bg-zinc-50 ring-zinc-200",
};

export default function PatientCensus() {
  const [searchQuery, setSearchQuery] = useState("");
  // { key, dir } as one cohesive value so toggle transitions stay atomic —
  // never catch a render where dir flipped but key didn't. Mirrors PatientsTable.tsx.
  const [sort, setSort] = useState<{ key: keyof Patient; dir: "asc" | "desc" }>({
    key: "room",
    dir: "asc",
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // WCAG dialog pattern — focus the close button on open, restore focus to the
  // originating row on close so keyboard users don't lose their place.
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
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

  // Escape closes — only attach the listener while open so we don't intercept globally.
  useEffect(() => {
    if (!selectedPatient) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPatient(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPatient]);

  // Focus orchestration: on open → close button; on close → originating row.
  // Driven by an effect (not the click handler) so it fires after the DOM swap.
  useEffect(() => {
    if (selectedPatient) {
      closeButtonRef.current?.focus();
    } else if (lastFocusedRowRef.current) {
      lastFocusedRowRef.current.focus();
      lastFocusedRowRef.current = null;
    }
  }, [selectedPatient]);

  const openPanel = (
    patient: Patient,
    e: React.MouseEvent<HTMLTableRowElement>
  ) => {
    lastFocusedRowRef.current = e.currentTarget;
    setSelectedPatient(patient);
  };

  // Same-key flips direction; new key resets to asc. Pattern from PatientsTable.tsx.
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
      <section className="w-full max-w-5xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <aside
          data-testid="detail-panel"
          role="region"
          aria-labelledby="detail-panel-name"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
            <button
              type="button"
              ref={closeButtonRef}
              data-testid="close-button"
              onClick={() => setSelectedPatient(null)}
              aria-label="Close patient details and return to roster"
              className="-mx-2 inline-flex items-center gap-1.5 rounded px-2 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <span aria-hidden="true">←</span>
              <span>Back to roster</span>
            </button>
            <StatusBadge status={selectedPatient.status} />
          </div>

          <div className="p-6">
            <h2
              id="detail-panel-name"
              className="text-2xl font-semibold tracking-tight text-zinc-900"
            >
              {selectedPatient.name}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Room{" "}
              <span className="font-mono text-zinc-700">{selectedPatient.room}</span>
              {" · "}
              Age <span className="tabular-nums">{selectedPatient.age}</span>
            </p>

            {/* Tier 1 — Diagnosis hero. The clinical "why are we here." Tinted by
                status so urgency reads at a glance before the eye lands on the badge. */}
            <div
              className={`mt-6 rounded-md p-4 ring-1 ring-inset ${DIAGNOSIS_TINT[selectedPatient.status]}`}
            >
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Diagnosis
              </p>
              <p className="mt-1 text-lg font-medium text-zinc-900">
                {selectedPatient.diagnosis}
              </p>
            </div>

            {/* Tier 2 — care ownership + length of stay. "Day N" leads because
                it's the scan cue; the calendar date trails as the audit trail. */}
            <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Physician
                </dt>
                <dd className="mt-1 text-sm text-zinc-900">{selectedPatient.physician}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Admitted
                </dt>
                <dd className="mt-1 flex items-baseline gap-2 text-sm text-zinc-900">
                  <span className="text-base font-semibold tabular-nums">
                    Day {daysSinceAdmitted(selectedPatient.admittedOn)}
                  </span>
                  <span className="text-xs text-zinc-500">
                    since {formatAdmitted(selectedPatient.admittedOn)}
                  </span>
                </dd>
              </div>
            </dl>

            {/* Tier 3 — billing context, demoted. Same data, lower visual weight. */}
            <p className="mt-6 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
              Insurance ·{" "}
              <span className="text-zinc-700">{selectedPatient.insurance}</span>
            </p>
          </div>
        </aside>
      </section>
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
        <input
          type="text"
          aria-label="Search by patient name"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 sm:w-72"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
              className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500"
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
              // tabIndex=-1 is programmatic-only focus — keeps rows out of the tab
              // order (no real grid keyboard pattern here yet) but lets us restore
              // focus to the originating row after the detail panel closes.
              tabIndex={-1}
              className="cursor-pointer border-b border-zinc-100 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
              onClick={(e) => openPanel(patient, e)}
            >
              <td className={`px-3 py-3 align-middle font-mono text-xs text-zinc-600 ${ROW_ACCENT[patient.status]}`}>
                {patient.room}
              </td>
              <td className="px-3 py-3 align-middle font-medium text-zinc-900">{patient.name}</td>
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
// - Default-sort by status instead of room — Critical/Needs Attention/Stable alphabetizes
//   in triage order, which is what a charge nurse opens this page for. Holding off because
//   the change is opinionated and the fixture's room-asc happens to be the natural eye-path.
// - Numeric/locale-aware comparators per column (age sorts as string today — fine at 2 digits,
//   breaks at 100+). Plumbing a comparator map per column key is the right shape.
// - Dedicated search input with clear button.
// - Sticky thead once the row count justifies it.
// - Dark-mode variants to match App's dark:bg-zinc-950.
// - Map the <th> columns from a config array (PatientsTable.tsx pattern) to kill
//   the header duplication if the column set grows.
// - Real keyboard nav on rows: ARIA grid pattern with arrow-key row navigation
//   + Enter to open the panel. Current tabIndex=-1 only supports programmatic focus
//   restoration after panel close, not row-as-tab-stop.
// - Focus trap inside the detail panel (Tab cycles within it). Skipping under
//   timer; with one focusable element in the panel it's a non-issue today.
