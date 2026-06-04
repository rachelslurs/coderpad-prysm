import { useState } from "react";
import { Badge, TextInput } from "@prysm/design-system";
import { Search, X } from "lucide-react";
import { PATIENTS, type Patient } from "../../data/patients";
import ResidentRow from "./ResidentRow";

type ResidentSearchProps = {
  /** Open a resident's chart (to document meals, etc.) — assignment or not. */
  onSelect: (patient: Patient) => void;
  /** Ids on the CNA's assignment, used to flag off-assignment results. */
  assignedIds: ReadonlySet<Patient["id"]>;
};

// Find-any-resident search in the status bar. A CNA sometimes documents on
// someone outside their assignment (logging a meal, a fall they witnessed), so
// search spans the whole unit — not just the roster. Results reuse the minimal
// resident row (picture + name + room — the two patient identifiers).
export default function ResidentSearch({
  onSelect,
  assignedIds,
}: ResidentSearchProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = q
    ? PATIENTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.room.toLowerCase().includes(q)
      ).slice(0, 6)
    : [];

  const pick = (patient: Patient) => {
    onSelect(patient);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-sm">
      <TextInput
        type="text"
        aria-label="Find any resident to document on"
        placeholder="Find any resident…"
        icon={Search}
        value={query}
        onChange={setQuery}
        trailing={
          query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="rounded text-neutral-400 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : undefined
        }
      />

      {q && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
          {matches.length > 0 ? (
            <ul className="max-h-80 divide-y divide-neutral-100 overflow-auto">
              {matches.map((p) => (
                <li key={p.id}>
                  <ResidentRow
                    patient={p}
                    minimal
                    onPress={() => pick(p)}
                    trailing={
                      assignedIds.has(p.id) ? undefined : (
                        <Badge tone="neutral" size="sm">
                          Off assignment
                        </Badge>
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-neutral-500">
              No residents match &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
