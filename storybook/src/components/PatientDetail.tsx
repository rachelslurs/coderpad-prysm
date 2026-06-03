import { useEffect, useRef } from "react";
import type { Patient } from "../types";
import { ArrowLeft, HandHeart, Stethoscope, Clock, Calendar, ShieldCheck } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatRoom, toInitials, calculateLOS } from "../lib/format";

type PatientDetailProps = {
  patient: Patient;
  hideNames: boolean;
  onClose: () => void;
};

export default function PatientDetail({
  patient,
  hideNames,
  onClose,
}: PatientDetailProps) {
  const displayName = hideNames ? toInitials(patient.name) : patient.name;
  // WCAG dialog pattern — focus the close (Back) button on open. PatientCensus
  // restores the originating row's focus on close.
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Escape closes — only attach the listener while mounted so we don't
  // intercept Escape elsewhere in the app when no panel is open.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const los = calculateLOS(patient.admittedOn);

  const tierLabel =
    "mb-3 text-sm font-bold uppercase tracking-widest text-slate-500";
  const fieldLabel = "text-sm font-semibold text-slate-500";
  const fieldValue = "text-xl font-bold text-slate-900";

  return (
    <aside
      data-testid="detail-panel"
      role="region"
      aria-label={`Details for ${displayName}`}
      tabIndex={-1}
      className="absolute inset-0 z-20 flex flex-col bg-slate-50 shadow-2xl"
    >
      <header className="flex-none border-b border-slate-200 bg-white px-6 py-5">
        <div className="-ml-2 mb-4 flex items-center gap-1.5">
          <button
            type="button"
            ref={closeButtonRef}
            data-testid="close-button"
            onClick={onClose}
            aria-label="Back to roster"
            className="inline-flex items-center gap-1.5 rounded border border-transparent px-3 py-2 text-base font-bold text-slate-500 transition-colors hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            <span>Back</span>
          </button>
          <span
            aria-hidden="true"
            className="hidden select-none rounded border border-slate-200 bg-slate-100/80 px-2 py-0.5 text-xs font-bold tracking-widest text-slate-400 sm:inline-block"
          >
            ESC
          </span>
        </div>

        <div className="flex items-start justify-between pr-2">
          <div>
            <h2 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
              {displayName}
            </h2>
            <div className="mb-1 flex items-baseline text-base font-bold uppercase tracking-widest text-slate-600">
              <span className="ml-1">Room {formatRoom(patient.room)}</span>
            </div>
          </div>
          <div className="mt-1 shrink-0">
            <StatusBadge status={patient.status} />
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-8 overflow-y-auto p-6">
        {/* TIER 1 — Clinical focus. The "why are we here." */}
        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm md:col-span-2">
              <div className="rounded bg-teal-50 p-2 text-teal-600">
                <HandHeart aria-hidden="true" className="h-4 w-4" />
              </div>
              <div>
                <div className={fieldLabel}>Primary Diagnosis</div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {patient.diagnosis}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-700">
                Day {los.days}
              </div>
            </div>
          </div>
        </section>

        {/* TIER 2 — Care context. Ownership + how long. */}
        <section>
          <h3 className={tierLabel}>Care Context</h3>
          <div className="divide-y divide-slate-100 rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 p-4">
              <div className="rounded bg-teal-50 p-2 text-teal-600">
                <Stethoscope aria-hidden="true" className="h-4 w-4" />
              </div>
              <div>
                <div className={fieldLabel}>Attending Physician</div>
                <div className={fieldValue}>{patient.physician}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="rounded bg-teal-50 p-2 text-teal-600">
                <Clock aria-hidden="true" className="h-4 w-4" />
              </div>
              <div>
                <div className={fieldLabel}>Patient Age</div>
                <div className={fieldValue}>{patient.age} years old</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="rounded bg-teal-50 p-2 text-teal-600">
                <Calendar aria-hidden="true" className="h-4 w-4" />
              </div>
              <div>
                <div className={fieldLabel}>Admitted</div>
                <div className={fieldValue}>{los.dateStr}</div>
              </div>
            </div>
          </div>
        </section>

        {/* TIER 3 — Admin. Billing context, demoted visually. */}
        <section>
          <h3 className={tierLabel}>Admin</h3>
          <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded bg-teal-50 p-2 text-teal-600">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            </div>
            <div>
              <div className={fieldLabel}>Primary Insurance</div>
              <div className={fieldValue}>{patient.insurance}</div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
