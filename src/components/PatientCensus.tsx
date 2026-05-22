import { useState, useEffect, useRef } from "react";
import { PATIENTS, type Patient } from "../../data/patients.ts";
import {
  Search,
  X,
  Eye,
  EyeOff,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import PatientDetail from "./PatientDetail";
import { formatRoom, toInitials } from "./format";

// Numeric triage rank — replaces the lexical localeCompare on `status`. Today's
// String(...).localeCompare(...) happens to sort Critical / Needs Attention / Stable
// in the right order by alphabet, but adds-a-future-status (e.g. "Discharged") drift
// silently. Rank encodes the actual clinical ordering.
const STATUS_RANK: Record<Patient["status"], number> = {
  Critical: 1,
  "Needs Attention": 2,
  Stable: 3,
};

const compareBy = (key: keyof Patient, a: Patient, b: Patient) => {
  if (key === "status") return STATUS_RANK[a.status] - STATUS_RANK[b.status];
  return String(a[key]).localeCompare(String(b[key]));
};

// First-cell left edge carries the status accent, paired with the badge for
// redundant encoding. Implemented as an inset box-shadow rather than a real
// border so it doesn't push cell content right (which would misalign with the
// no-border thead).
const ROW_ACCENT: Record<Patient["status"], string> = {
  Critical: "shadow-[inset_4px_0_0_#f43f5e]",
  "Needs Attention": "shadow-[inset_4px_0_0_#f59e0b]",
  Stable: "",
};

export default function PatientCensus() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<{ key: keyof Patient; dir: "asc" | "desc" }>(
    { key: "room", dir: "asc" }
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [hideNames, setHideNames] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const lastFocusedRowRef = useRef<HTMLTableRowElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // "/" anywhere focuses the search input — common pattern (GitHub, Slack,
  // GitLab). Skip when the user is already typing into a field so a literal
  // slash still types as a character there.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visiblePatients = [...PATIENTS]
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const cmp = compareBy(sort.key, a, b);
      return sort.dir === "asc" ? cmp : -cmp;
    });

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

  const handleSort = (key: keyof Patient) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const ariaSortFor = (
    key: keyof Patient
  ): "ascending" | "descending" | "none" =>
    sort.key === key
      ? sort.dir === "asc"
        ? "ascending"
        : "descending"
      : "none";

  const SortIcon = ({ columnKey }: { columnKey: keyof Patient }) => {
    if (sort.key !== columnKey) {
      return (
        <ArrowUpDown
          aria-hidden="true"
          className="ml-1 inline-block h-4 w-4 text-slate-400"
        />
      );
    }
    const Arrow = sort.dir === "asc" ? ArrowUp : ArrowDown;
    return (
      <Arrow
        aria-hidden="true"
        className="ml-1 inline-block h-4 w-4 text-teal-600"
      />
    );
  };

  const thBase =
    "bg-white px-6 py-5 text-left font-['Archivo'] text-lg font-bold whitespace-nowrap transition-colors";
  const thInactive = `${thBase} border-b-2 border-slate-200 text-slate-700`;
  // Sortable headers carry click+keyboard handlers on the <th> itself so the
  // entire cell is the hit target. Active-sort gets teal text/bg/border —
  // keep border-b-2 in both directions so nothing visually jumps when the
  // user toggles the direction.
  const sortableTh =
    "cursor-pointer select-none hover:text-teal-700 focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500";
  const thFor = (key: keyof Patient) => {
    if (sort.key !== key) return `${thInactive} ${sortableTh}`;
    return `${thBase} border-b-2 border-teal-500 bg-teal-50/60 text-teal-700 ${sortableTh}`;
  };
  const sortableThProps = (key: keyof Patient) => ({
    scope: "col" as const,
    "aria-sort": ariaSortFor(key),
    className: thFor(key),
    tabIndex: 0,
    onClick: () => handleSort(key),
    onKeyDown: (e: React.KeyboardEvent<HTMLTableCellElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSort(key);
      }
    },
  });

  return (
    <>
      <header className="grid flex-none grid-cols-2 items-center border-b border-slate-800 bg-slate-900 px-6 py-5 shadow-md md:grid-cols-3">
        <h1 className="hidden items-baseline gap-2 whitespace-nowrap font-['Archivo'] text-xl font-black tracking-tight text-white md:inline-flex">
          <span>1 North</span>
          <span className="text-lg font-medium text-slate-400">Census</span>
        </h1>

        <div className="group relative justify-self-start md:justify-self-center">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-200"
            />
            <input
              ref={searchInputRef}
              type="text"
              aria-label="Search by patient name (shortcut: press / from anywhere)"
              placeholder="Find patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setSearchFocused(true);
                // Focusing search is an intent shift back to the roster — close
                // the detail overlay if it's open. Null out the row-restore ref
                // first so the close effect doesn't steal focus from the input.
                if (selectedPatient) {
                  lastFocusedRowRef.current = null;
                  setSelectedPatient(null);
                }
              }}
              onBlur={() => setSearchFocused(false)}
              className="w-80 rounded border border-slate-700 bg-slate-800 py-2 pl-10 pr-9 text-base text-slate-100 placeholder:text-slate-400 focus:border-slate-400 focus:bg-slate-950 focus:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded text-slate-400 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              !searchFocused && (
                <kbd
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 font-mono text-xs font-bold tracking-widest text-slate-400 sm:inline-block"
                >
                  /
                </kbd>
              )
            )}
        </div>

        <button
          type="button"
          onClick={() => setHideNames(!hideNames)}
          aria-pressed={hideNames}
          className={`inline-flex items-center gap-2 justify-self-end whitespace-nowrap rounded border px-3 py-2 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
            hideNames
              ? "border-teal-500 bg-teal-500 text-white hover:bg-teal-400"
              : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {hideNames ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
          {hideNames ? "Privacy on" : "Privacy off"}
        </button>
      </header>

      <main className="relative flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
        {/* table-fixed + colgroup locks column widths so filtered or empty
            results don't reflow the layout. Diagnosis is the only flexible
            column — it absorbs leftover width. */}
        <table className="w-full table-fixed border-collapse text-lg text-slate-900">
          <colgroup>
            <col className="w-20" />
            <col className="w-60" />
            <col className="w-16" />
            <col className="w-44" />
            <col className="w-72" />
            <col className="w-56" />
          </colgroup>
          <thead className="sticky top-0 z-10">
            <tr>
              <th {...sortableThProps("room")}>
                <span className="flex items-center justify-between gap-2">
                  <span>Room</span>
                  <SortIcon columnKey="room" />
                </span>
              </th>
              <th {...sortableThProps("name")}>
                <span className="flex items-center justify-between gap-2">
                  <span>Patient</span>
                  <SortIcon columnKey="name" />
                </span>
              </th>
              <th scope="col" className={thInactive}>
                Age
              </th>
              <th scope="col" className={thInactive}>
                Physician
              </th>
              <th scope="col" className={thInactive}>
                Diagnosis
              </th>
              <th {...sortableThProps("status")}>
                <span className="flex items-center justify-between gap-2">
                  <span>Status</span>
                  <SortIcon columnKey="status" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visiblePatients.map((patient) => (
              <tr
                key={patient.id}
                tabIndex={0}
                // transition-[background-color] (not transition-colors) so the
                // divide-y border between rows doesn't animate when sort
                // reorders the DOM — border-color is part of transition-colors.
                className="group cursor-pointer transition-[background-color] hover:bg-teal-50 focus:outline-none focus-visible:bg-teal-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600"
                onClick={(e) => openPanel(patient, e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPanel(patient, e);
                  }
                }}
              >
                <td
                  className={`px-6 py-3.5 align-middle font-['Archivo'] text-base text-slate-600 ${ROW_ACCENT[patient.status]}`}
                >
                  {formatRoom(patient.room)}
                </td>
                <td className="px-6 py-3.5 align-middle font-['Archivo'] text-xl font-black text-slate-900">
                  {hideNames ? toInitials(patient.name) : patient.name}
                </td>
                <td className="px-6 py-3.5 align-middle tabular-nums text-slate-700">
                  {patient.age}
                </td>
                <td className="px-6 py-3.5 align-middle text-slate-600">
                  {patient.physician}
                </td>
                <td className="px-6 py-3.5 align-middle text-slate-600">
                  {patient.diagnosis}
                </td>
                <td className="px-6 py-3.5 align-middle">
                  <StatusBadge status={patient.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visiblePatients.length === 0 && (
          <div
            role="status"
            className="px-4 py-12 text-center text-base text-slate-500"
          >
            No patients match your search.
          </div>
        )}
        </div>

        {selectedPatient && (
          <PatientDetail
            patient={selectedPatient}
            hideNames={hideNames}
            onClose={() => setSelectedPatient(null)}
          />
        )}
      </main>
    </>
  );
}
