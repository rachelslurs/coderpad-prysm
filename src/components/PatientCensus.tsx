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
// redundant encoding. Selection swaps it to solid teal in the same slot so the
// indicator location is stable.
const ROW_ACCENT: Record<Patient["status"], string> = {
  Critical: "border-l-4 border-l-rose-500",
  "Needs Attention": "border-l-4 border-l-amber-500",
  Stable: "border-l-4 border-l-transparent",
};

export default function PatientCensus() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<{ key: keyof Patient; dir: "asc" | "desc" }>(
    { key: "room", dir: "asc" }
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [hideNames, setHideNames] = useState(false);

  const lastFocusedRowRef = useRef<HTMLTableRowElement | null>(null);

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

  const ariaSortFor = (key: keyof Patient) =>
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
          className="ml-1 inline-block h-3 w-3 text-slate-400"
        />
      );
    }
    const Arrow = sort.dir === "asc" ? ArrowUp : ArrowDown;
    return (
      <Arrow
        aria-hidden="true"
        className="ml-1 inline-block h-3 w-3 text-teal-600"
      />
    );
  };

  const thBase =
    "border-b-2 border-slate-200 bg-white px-4 py-3 text-left font-['Archivo'] text-base font-bold text-slate-700";
  const sortButton =
    "inline-flex items-center gap-1 rounded transition-colors hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500";

  return (
    <>
      <header className="flex h-16 flex-none items-center justify-between border-b border-slate-800 bg-slate-900 px-6 shadow-md">
        <div className="flex items-center gap-6">
          <h1 className="font-['Archivo'] text-2xl font-black tracking-tight text-white">
            1 North{" "}
            <span className="ml-2 rounded bg-teal-500/10 px-2 py-0.5 text-base font-medium text-teal-400">
              Census
            </span>
          </h1>

          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-500/70"
            />
            <input
              type="text"
              aria-label="Search by patient name"
              placeholder="Find patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded border border-slate-700 bg-slate-800 py-1.5 pl-9 pr-8 text-sm text-slate-100 placeholder:text-slate-400 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded text-slate-400 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setHideNames(!hideNames)}
          aria-pressed={hideNames}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
            hideNames
              ? "bg-teal-500 text-white hover:bg-teal-400"
              : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
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
        <table className="w-full table-fixed border-collapse text-sm text-slate-900">
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
              <th scope="col" aria-sort={ariaSortFor("room")} className={thBase}>
                <button
                  type="button"
                  onClick={() => handleSort("room")}
                  className={sortButton}
                >
                  <span>Room</span>
                  <SortIcon columnKey="room" />
                </button>
              </th>
              <th
                scope="col"
                aria-sort={ariaSortFor("name")}
                className={`${thBase} min-w-44`}
              >
                <button
                  type="button"
                  onClick={() => handleSort("name")}
                  className={sortButton}
                >
                  <span>Patient</span>
                  <SortIcon columnKey="name" />
                </button>
              </th>
              <th scope="col" className={thBase}>
                Age
              </th>
              <th scope="col" className={thBase}>
                Physician
              </th>
              <th scope="col" className={thBase}>
                Diagnosis
              </th>
              <th
                scope="col"
                aria-sort={ariaSortFor("status")}
                className={thBase}
              >
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className={sortButton}
                >
                  <span>Status</span>
                  <SortIcon columnKey="status" />
                </button>
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
                className="group cursor-pointer transition-[background-color] hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600"
                onClick={(e) => openPanel(patient, e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPanel(patient, e);
                  }
                }}
              >
                <td
                  className={`px-4 py-3.5 align-middle font-['Archivo'] text-sm text-slate-600 ${ROW_ACCENT[patient.status]}`}
                >
                  {formatRoom(patient.room)}
                </td>
                <td className="px-4 py-3.5 align-middle font-['Archivo'] text-lg font-black text-slate-900">
                  {hideNames ? toInitials(patient.name) : patient.name}
                </td>
                <td className="px-4 py-3.5 align-middle tabular-nums text-slate-700">
                  {patient.age}
                </td>
                <td className="px-4 py-3.5 align-middle text-slate-600">
                  {patient.physician}
                </td>
                <td className="px-4 py-3.5 align-middle text-slate-600">
                  {patient.diagnosis}
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <StatusBadge status={patient.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visiblePatients.length === 0 && (
          <div
            role="status"
            className="px-4 py-12 text-center text-sm text-slate-500"
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
