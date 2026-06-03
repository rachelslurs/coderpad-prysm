import type { Patient } from "../../data/patients";
import {
  ArrowLeft,
  HandHeart,
  Stethoscope,
  Clock,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import {
  Button,
  Card,
  IconField,
  Kbd,
  OverlayPanel,
  Section,
  toInitials,
} from "@prysm/design-system";
import StatusBadge from "./StatusBadge";
import { formatRoom, calculateLOS } from "../lib/format";

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
  const los = calculateLOS(patient.admittedOn);

  return (
    // OverlayPanel owns the WCAG plumbing (focus the Back button on open, Escape
    // to close). PatientCensus restores the originating row's focus on close.
    <OverlayPanel
      onClose={onClose}
      role="region"
      aria-label={`Details for ${displayName}`}
      data-testid="detail-panel"
      className="bg-neutral-50"
    >
      <header className="flex-none border-b border-neutral-200 bg-white px-6 py-5">
        <div className="-ml-2 mb-4 flex items-center gap-1.5">
          <Button
            variant="ghost"
            tone="accent"
            iconLeft={ArrowLeft}
            onClick={onClose}
            aria-label="Back to roster"
            data-testid="close-button"
          >
            Back
          </Button>
          <Kbd aria-hidden="true" className="hidden sm:inline-block">
            ESC
          </Kbd>
        </div>

        <div className="flex items-start justify-between pr-2">
          <div>
            <h2 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight text-neutral-900">
              {displayName}
            </h2>
            <div className="mb-1 flex items-baseline text-base font-bold uppercase tracking-widest text-neutral-600">
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
        <Section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <IconField icon={HandHeart} label="Primary Diagnosis" size="lg">
                {patient.diagnosis}
              </IconField>
            </Card>
            <Card className="flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold text-neutral-700">
                Day {los.days}
              </div>
            </Card>
          </div>
        </Section>

        {/* TIER 2 — Care context. Ownership + how long. */}
        <Section title="Care Context">
          <Card padding="none" className="divide-y divide-neutral-100">
            <IconField
              icon={Stethoscope}
              label="Attending Physician"
              className="p-4"
            >
              {patient.physician}
            </IconField>
            <IconField icon={Clock} label="Patient Age" className="p-4">
              {patient.age} years old
            </IconField>
            <IconField icon={Calendar} label="Admitted" className="p-4">
              {los.dateStr}
            </IconField>
          </Card>
        </Section>

        {/* TIER 3 — Admin. Billing context, demoted visually. */}
        <Section title="Admin">
          <Card>
            <IconField icon={ShieldCheck} label="Primary Insurance">
              {patient.insurance}
            </IconField>
          </Card>
        </Section>
      </div>
    </OverlayPanel>
  );
}
