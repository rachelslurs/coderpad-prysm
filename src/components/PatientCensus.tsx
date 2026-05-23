import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PATIENTS, type Patient } from "../../data/patients.ts";
import {
  Search,
  X,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import PatientDetail from "./PatientDetail";
import { formatRoom, toInitials } from "./format";

// Numeric triage rank — `Discharged` could land anywhere alphabetically and
// triage order stays correct.
const STATUS_RANK: Record<Patient["status"], number> = {
  Critical: 1,
  "Needs Attention": 2,
  Stable: 3,
};

// Per-column comparator. Each override matches the column's real ordering:
// status by triage rank, age numerically, room with natural-order so "9" <
// "10" and "101A" < "101B" both hold. Patient (name) is intentionally not
// overridden — the display reads "First Last" so the sort needs to match;
// fixing it correctly means flipping the display to "Last, First" as a paired
// change, which we haven't done yet. Other keys fall back to a stringified
// localeCompare.
const COMPARATORS: Partial<
  Record<keyof Patient, (a: Patient, b: Patient) => number>
> = {
  status: (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status],
  age: (a, b) => a.age - b.age,
  room: (a, b) => a.room.localeCompare(b.room, undefined, { numeric: true }),
};

const compareBy = (key: keyof Patient, a: Patient, b: Patient) => {
  const cmp = COMPARATORS[key];
  return cmp ? cmp(a, b) : String(a[key]).localeCompare(String(b[key]));
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
  // Roving-tabindex active row. Only one <tr> at a time has tabIndex={0}; all
  // others are tabIndex={-1}. Tab into the table lands on the active row,
  // arrow keys then move within the table without consuming additional tab
  // stops.
  const [activeRowIndex, setActiveRowIndex] = useState(0);

  const lastFocusedRowRef = useRef<HTMLTableRowElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);
  // Set when arrow keys / Home / End change activeRowIndex — the effect below
  // will move focus on the next render. Click- and Tab-driven focus changes
  // sync activeRowIndex via onFocus instead, without setting this flag.
  const shouldFocusActiveRow = useRef(false);

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

  // Memoized on (searchQuery, sort) — recomputes only when query or sort
  // changes, not on every unrelated state tick (hideNames, arrow-key
  // navigation, panel open/close). Also hoists the query .toLowerCase()
  // out of the filter callback so it runs once per recompute, not once
  // per patient.
  const visiblePatients = useMemo(() => {
    const needle = searchQuery.toLowerCase();
    return [...PATIENTS]
      .filter((p) => p.name.toLowerCase().includes(needle))
      .sort((a, b) => {
        const cmp = compareBy(sort.key, a, b);
        return sort.dir === "asc" ? cmp : -cmp;
      });
  }, [searchQuery, sort]);

  useEffect(() => {
    if (!selectedPatient && lastFocusedRowRef.current) {
      lastFocusedRowRef.current.focus();
      lastFocusedRowRef.current = null;
    }
  }, [selectedPatient]);

  // When the filter shrinks the visible set below the current active index,
  // pull the active index back into range so a focusable row still exists.
  useEffect(() => {
    if (
      visiblePatients.length > 0 &&
      activeRowIndex >= visiblePatients.length
    ) {
      setActiveRowIndex(visiblePatients.length - 1);
    }
  }, [visiblePatients.length, activeRowIndex]);

  // Arrow keys set shouldFocusActiveRow — after the render commits the new
  // tabIndex assignments, we move focus to the new active row. Click/tab-
  // driven focus changes don't set the flag; their onFocus handlers sync
  // activeRowIndex without calling focus().
  useLayoutEffect(() => {
    if (shouldFocusActiveRow.current) {
      rowRefs.current[activeRowIndex]?.focus();
      shouldFocusActiveRow.current = false;
    }
  }, [activeRowIndex]);

  const moveActiveRow = (target: number) => {
    const clamped = Math.max(
      0,
      Math.min(target, visiblePatients.length - 1)
    );
    if (clamped !== activeRowIndex) {
      shouldFocusActiveRow.current = true;
      setActiveRowIndex(clamped);
    }
  };

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

  // Stacked chevrons so both directions are always visible — the active one
  // lights teal, the other stays slate. Reads more clearly than a single
  // arrow that swaps in/out: the user can see which direction "more sort"
  // would go.
  const SortIcon = ({ columnKey }: { columnKey: keyof Patient }) => {
    const isActive = sort.key === columnKey;
    const ascActive = isActive && sort.dir === "asc";
    const descActive = isActive && sort.dir === "desc";
    return (
      <span
        aria-hidden="true"
        className="ml-1 inline-flex flex-col leading-none"
      >
        <ChevronUp
          className={`h-4 w-4 ${ascActive ? "text-teal-800" : "text-slate-500"}`}
        />
        <ChevronDown
          className={`-mt-1.5 h-4 w-4 ${descActive ? "text-teal-800" : "text-slate-500"}`}
        />
      </span>
    );
  };

  const thBase =
    "bg-white px-6 py-4 text-left text-lg font-bold whitespace-nowrap transition-colors";
  const thInactive = `${thBase} border-b-2 border-slate-200 text-slate-700`;
  // Sortable headers carry click+keyboard handlers on the <th> itself so the
  // entire cell is the hit target. Active-sort gets teal text/bg/border —
  // keep border-b-2 in both directions so nothing visually jumps when the
  // user toggles the direction.
  const sortableTh =
    "cursor-pointer select-none hover:text-teal-700 focus:outline-none focus-visible:bg-teal-100 focus-visible:text-teal-800 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-teal-700";
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
      <header className="grid flex-none grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-800 bg-slate-900 px-6 py-4 shadow-md md:grid-cols-3">
        <h1 className="hidden items-baseline gap-2 whitespace-nowrap text-xl font-semibold tracking-normal text-white/90 md:inline-flex">
          1 North Census
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
              // No debounce: filter is in-memory and now memoized, so per-
              // keystroke cost is one filter+sort over PATIENTS.length. Add
              // debounce (150-250ms) + AbortController the day this becomes a
              // server query or PATIENTS grows past a few hundred — at that
              // point cost shifts from compute to network thrash.
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
          aria-label={hideNames ? "Privacy on" : "Privacy off"}
          className={`inline-flex min-h-[42px] items-center gap-2 justify-self-end whitespace-nowrap rounded border px-3 py-2 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
            hideNames
              ? "border-teal-500 bg-teal-400 text-white hover:bg-teal-400"
              : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {hideNames ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
          <span className="hidden md:inline">
            {hideNames ? "Privacy on" : "Privacy off"}
          </span>
        </button>
      </header>

      <main className="relative flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
        {/* table-fixed + colgroup locks column widths so filtered or empty
            results don't reflow the layout. Diagnosis is the only flexible
            column — it absorbs leftover width. */}
        <table className="w-full table-fixed border-collapse text-lg text-slate-900">
          <colgroup>
            <col className="w-32" />
            <col className="w-60" />
            <col className="w-20" />
            <col className="w-52" />
            <col className="w-72" />
            <col className="w-56" />
          </colgroup>
          <thead className="sticky top-0 z-10">
            <tr>
              <th {...sortableThProps("room")}>
                <span className="flex w-full items-center justify-between gap-2">
                  <span>Room</span>
                  <SortIcon columnKey="room" />
                </span>
              </th>
              <th {...sortableThProps("name")}>
                <span className="flex w-full items-center justify-between gap-2">
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
                <span className="flex w-full items-center justify-between gap-2">
                  <span>Status</span>
                  <SortIcon columnKey="status" />
                </span>
              </th>
            </tr>
          </thead>
          {/* No virtualization. table-fixed + colgroup locks layout so scroll
              cost is just paint. At ~200+ rows, switch to row windowing
              (TanStack Virtual) — that's also the moment to move from <table>
              to role="grid" divs, since virtualizing a real <table> fights the
              native sticky <thead> above, and grid divs pair naturally with
              the full ARIA grid pattern in README "Next sprint". */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {/* Inlined row render with fresh closures per render. At this size
                the closure churn and lack of row-level memoization are
                unmeasurable. When row count crosses ~100, extract <PatientRow
                />, React.memo it, and stabilize the three handlers below —
                onClick/onFocus/onKeyDown all close over `i`, so this likely
                wants a single delegated keydown on <tbody> reading data-row-
                index, not per-row useCallback. Pair with virtualization (see
                the comment above and README "When this scales") — same
                trigger, same testing burden. */}
            {visiblePatients.map((patient, i) => (
              <tr
                key={patient.id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                tabIndex={activeRowIndex === i ? 0 : -1}
                // Zebra striping for visual rhythm; active row (roving tabindex
                // target) bumps a step darker than even rows so it still reads
                // as distinct. Hover (teal-50) wins over both. transition-
                // [background-color] (not transition-colors) so the divide-y
                // border between rows doesn't animate when sort reorders the
                // DOM — border-color is part of transition-colors.
                className={`group cursor-pointer transition-[background-color] hover:bg-teal-50 focus:outline-none focus-visible:bg-teal-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600 ${
                  activeRowIndex === i
                    ? "bg-teal-50"
                    : i % 2 === 1
                      ? "bg-slate-50"
                      : ""
                }`}
                onClick={(e) => openPanel(patient, e)}
                onFocus={() => setActiveRowIndex(i)}
                onKeyDown={(e) => {
                  switch (e.key) {
                    case "Enter":
                    case " ":
                      e.preventDefault();
                      openPanel(patient, e);
                      break;
                    case "ArrowDown":
                      e.preventDefault();
                      moveActiveRow(i + 1);
                      break;
                    case "ArrowUp":
                      e.preventDefault();
                      moveActiveRow(i - 1);
                      break;
                    case "Home":
                      e.preventDefault();
                      moveActiveRow(0);
                      break;
                    case "End":
                      e.preventDefault();
                      moveActiveRow(visiblePatients.length - 1);
                      break;
                  }
                }}
              >
                <td
                  className={`px-6 py-3.5 align-middle text-base text-slate-600 ${ROW_ACCENT[patient.status]}`}
                >
                  {formatRoom(patient.room)}
                </td>
                <td className="px-6 py-3.5 align-middle text-xl font-extrabold leading-tight text-slate-900">
                  {hideNames ? toInitials(patient.name) : patient.name}
                </td>
                <td className="px-6 py-3.5 align-middle text-base tabular-nums text-slate-600">
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
