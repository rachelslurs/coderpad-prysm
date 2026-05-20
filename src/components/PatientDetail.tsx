import { useEffect, useRef } from "react";
import type { Patient } from "../../data/patients.ts";
import StatusBadge from "./StatusBadge";

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

type PatientDetailProps = {
  patient: Patient;
  onClose: () => void;
};

export default function PatientDetail({ patient, onClose }: PatientDetailProps) {
  // WCAG dialog pattern — focus the close button on open. Row-focus restoration
  // on close stays in PatientCensus, which owns the originating row ref.
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Escape closes — only attach the listener while mounted so we don't intercept globally.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
            onClick={onClose}
            aria-label="Close patient details and return to roster"
            className="-mx-2 inline-flex items-center gap-1.5 rounded px-2 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span aria-hidden="true">←</span>
            <span>Back to roster</span>
          </button>
          <StatusBadge status={patient.status} />
        </div>

        <div className="p-6">
          <h2
            id="detail-panel-name"
            className="text-2xl font-semibold tracking-tight text-zinc-900"
          >
            {patient.name}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Room{" "}
            <span className="font-mono text-zinc-700">{patient.room}</span>
            {" · "}
            Age <span className="tabular-nums">{patient.age}</span>
          </p>

          {/* Tier 1 — Diagnosis hero. The clinical "why are we here." Tinted by
              status so urgency reads at a glance before the eye lands on the badge. */}
          <div
            className={`mt-6 rounded-md p-4 ring-1 ring-inset ${DIAGNOSIS_TINT[patient.status]}`}
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Diagnosis
            </p>
            <p className="mt-1 text-lg font-medium text-zinc-900">
              {patient.diagnosis}
            </p>
          </div>

          {/* Tier 2 — care ownership + length of stay. "Day N" leads because
              it's the scan cue; the calendar date trails as the audit trail. */}
          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Physician
              </dt>
              <dd className="mt-1 text-sm text-zinc-900">{patient.physician}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Admitted
              </dt>
              <dd className="mt-1 flex items-baseline gap-2 text-sm text-zinc-900">
                <span className="text-base font-semibold tabular-nums">
                  Day {daysSinceAdmitted(patient.admittedOn)}
                </span>
                <span className="text-xs text-zinc-500">
                  since {formatAdmitted(patient.admittedOn)}
                </span>
              </dd>
            </div>
          </dl>

          {/* Tier 3 — billing context, demoted. Same data, lower visual weight. */}
          <p className="mt-6 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
            Insurance ·{" "}
            <span className="text-zinc-700">{patient.insurance}</span>
          </p>
        </div>
      </aside>
    </section>
  );
}
