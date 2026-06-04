import { useState } from "react";
import {
  AppBar,
  Badge,
  Button,
  Card,
  OverlayPanel,
  Segmented,
  Select,
  TextArea,
} from "@prysm/design-system";
import { ArrowRight, ChevronRight, Clock, Plus } from "lucide-react";
import type { Patient } from "../../data/patients";
import {
  ASSIGNMENTS,
  DEFAULT_ASSIGNMENT_ID,
  unassignedForAssignment,
} from "../../data/assignment";
import {
  buildInitialAssignment,
  effectiveRoster,
  hasPendingRequests,
  type AssignmentItem,
} from "../lib/assignment";
import { formatRoom } from "../lib/format";
import ResidentRow from "./ResidentRow";

type AssignmentSelectionProps = {
  /** Confirm the assignment and start the shift — the preferred path. */
  onConfirm: (items: AssignmentItem[]) => void;
  /**
   * Start the shift before confirming an assignment (e.g. the supervisor hasn't
   * finalized it yet). Optional — when omitted, only the confirm path shows.
   */
  onStartWithoutAssignment?: () => void;
};

// Which adjustment dialog (if any) is open. Adjustments are deliberately behind
// a modal + a required reason — the friction that keeps the supervisor's list
// the default, not the exception.
type Dialog = { kind: "remove"; patient: Patient } | { kind: "add" } | null;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

// The pre-shift gate: the CNA reviews the residents their supervisor pre-assigned
// (name + room — just confirming *who*) and confirms to start. Removing or adding
// a resident is possible but routes to a supervisor and never blocks starting.
export default function AssignmentSelection({
  onConfirm,
  onStartWithoutAssignment,
}: AssignmentSelectionProps) {
  const [assignmentId, setAssignmentId] = useState(DEFAULT_ASSIGNMENT_ID);
  const [items, setItems] = useState<AssignmentItem[]>(buildInitialAssignment);
  const [showAdjust, setShowAdjust] = useState(false);
  // Tier 2 — editing residents one-by-one — is the last resort, gated behind an
  // explicit "none of these assignments are mine" escalation.
  const [editResidents, setEditResidents] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [reason, setReason] = useState("");
  const [addId, setAddId] = useState<string | null>(null);

  const addable = unassignedForAssignment(assignmentId).filter(
    (p) => !items.some((i) => i.patient.id === p.id)
  );

  // Tier 1 — switching to a different supervisor-defined group — is a clean swap
  // of the whole list (and clears any in-progress per-resident edits).
  const switchAssignment = (id: string) => {
    setAssignmentId(id);
    setItems(buildInitialAssignment(id));
    setEditResidents(false);
  };

  const closeDialog = () => {
    setDialog(null);
    setReason("");
    setAddId(null);
  };

  const requestRemoval = (patient: Patient) => {
    setItems((prev) =>
      prev.map((i) =>
        i.patient.id === patient.id
          ? { ...i, state: "removal-requested", reason }
          : i
      )
    );
    closeDialog();
  };

  const requestAddition = () => {
    const patient = addable.find((p) => String(p.id) === addId);
    if (!patient) return;
    setItems((prev) => [
      ...prev,
      { patient, state: "addition-requested", reason },
    ]);
    closeDialog();
  };

  // Undo a removal request — keeping a resident is always frictionless.
  const keep = (patient: Patient) =>
    setItems((prev) =>
      prev.map((i) =>
        i.patient.id === patient.id
          ? { patient: i.patient, state: "assigned" }
          : i
      )
    );

  // Drop an addition request entirely (it was never on the supervisor's list).
  const cancelAddition = (patient: Patient) =>
    setItems((prev) => prev.filter((i) => i.patient.id !== patient.id));

  const rowTrailing = (item: AssignmentItem) => {
    const flag =
      item.state === "removal-requested" ? (
        <Badge tone="warning" size="sm" icon={Clock}>
          Removal requested
        </Badge>
      ) : item.state === "addition-requested" ? (
        <Badge tone="info" size="sm" icon={Clock}>
          Added · pending
        </Badge>
      ) : null;

    const action = editResidents ? (
      item.state === "removal-requested" ? (
        <Button size="sm" variant="ghost" onClick={() => keep(item.patient)}>
          Keep
        </Button>
      ) : item.state === "addition-requested" ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => cancelAddition(item.patient)}
        >
          Cancel
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          tone="danger"
          onClick={() => setDialog({ kind: "remove", patient: item.patient })}
        >
          Remove
        </Button>
      )
    ) : null;

    if (!flag && !action) return undefined;
    return (
      <div className="flex items-center gap-2">
        {flag}
        {action}
      </div>
    );
  };

  const effectiveCount = effectiveRoster(items).length;
  const pendingCount = items.filter((i) => i.state !== "assigned").length;

  return (
    <div className="relative flex h-full flex-col bg-neutral-50">
      <AppBar
        tone="light"
        className="flex-none"
        start={
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-neutral-900">
              1 North
            </span>
            <span className="text-sm text-neutral-500">Skilled Nursing</span>
          </span>
        }
        end={
          <Badge tone="neutral" size="sm">
            Start of shift
          </Badge>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-6 py-10">
          <header className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-700">
              Your assignment
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-900">
              Review &amp; confirm
            </h1>
            <p className="mt-2 text-base text-neutral-600">
              Your supervisor assigned these residents to you for this shift.
              Confirming means you&rsquo;re accepting responsibility for their
              care — it&rsquo;s the right way to start.
            </p>
          </header>

          <Card padding="none" className="divide-y divide-neutral-100">
            {items.map((item) => (
              <ResidentRow
                key={item.patient.id}
                patient={item.patient}
                minimal
                trailing={rowTrailing(item)}
              />
            ))}
          </Card>

          {/* Adjustments — tucked away. The default path is simply to confirm. */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowAdjust((v) => !v)}
              aria-expanded={showAdjust}
              className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-neutral-500 hover:text-neutral-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
            >
              <ChevronRight
                aria-hidden="true"
                className={`h-4 w-4 transition-transform ${showAdjust ? "rotate-90" : ""}`}
              />
              Need to change this list?
            </button>

            {showAdjust && (
              <div className="mt-3 space-y-4 rounded-md border border-neutral-200 bg-white p-4">
                {/* Tier 1 — switch to the correct supervisor-defined group. */}
                <div>
                  <p className="text-sm text-neutral-600">
                    If this isn&rsquo;t your group, switch to the right
                    assignment — that&rsquo;s better than editing residents one
                    by one.
                  </p>
                  <div className="mt-3">
                    <Segmented
                      variant="picker"
                      label="Choose your assignment"
                      value={assignmentId}
                      onChange={switchAssignment}
                      options={ASSIGNMENTS.map((a) => ({
                        value: a.id,
                        label: (
                          <span>
                            {a.label}{" "}
                            <span className="font-normal text-neutral-400">
                              · {a.patientIds.length}
                            </span>
                          </span>
                        ),
                      }))}
                    />
                  </div>
                </div>

                {/* Tier 2 — last resort: edit residents individually. */}
                <div className="border-t border-neutral-100 pt-3">
                  {!editResidents ? (
                    <button
                      type="button"
                      onClick={() => setEditResidents(true)}
                      className="rounded text-sm font-semibold text-neutral-500 underline-offset-2 hover:text-neutral-700 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
                    >
                      None of these are mine — add or remove residents instead
                    </button>
                  ) : (
                    <>
                      <p className="text-sm text-neutral-600">
                        Editing residents individually is the last resort. Each
                        change goes to your supervisor for review and{" "}
                        <span className="font-semibold text-neutral-800">
                          won&rsquo;t delay your shift
                        </span>{" "}
                        — use the row controls above, or:
                      </p>
                      <Button
                        className="mt-3"
                        size="sm"
                        variant="outline"
                        iconLeft={Plus}
                        onClick={() => setDialog({ kind: "add" })}
                        disabled={addable.length === 0}
                      >
                        Add a resident
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">
                {plural(effectiveCount, "resident")}
              </span>{" "}
              on your assignment
              {hasPendingRequests(items) && (
                <>
                  {" · "}
                  <span className="font-semibold text-warning-700">
                    {plural(pendingCount, "change")} pending supervisor review
                  </span>
                </>
              )}
            </p>
            <div className="flex items-center gap-4">
              {onStartWithoutAssignment && (
                <button
                  type="button"
                  data-testid="start-without-assignment"
                  onClick={onStartWithoutAssignment}
                  className="rounded text-sm font-semibold text-neutral-500 hover:text-neutral-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
                >
                  Assignment not ready? Start shift now
                </button>
              )}
              <Button
                size="touch"
                iconRight={ArrowRight}
                data-testid="confirm-shift"
                onClick={() => onConfirm(items)}
              >
                Confirm &amp; start shift
              </Button>
            </div>
          </div>
        </div>
      </div>

      {dialog && (
        <OverlayPanel
          onClose={closeDialog}
          role="dialog"
          aria-modal="true"
          aria-label={
            dialog.kind === "remove"
              ? `Request removal of ${dialog.patient.name}`
              : "Add a resident to your assignment"
          }
          className="items-center justify-center bg-neutral-950/50 p-6 backdrop-blur-sm"
        >
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-extrabold text-neutral-900">
              {dialog.kind === "remove"
                ? "Request to remove a resident"
                : "Request to add a resident"}
            </h2>
            {dialog.kind === "remove" ? (
              <p className="mt-1 text-sm text-neutral-600">
                {dialog.patient.name} · Room {formatRoom(dialog.patient.room)}.
                They stay on your roster until a supervisor reviews this.
              </p>
            ) : (
              <p className="mt-1 text-sm text-neutral-600">
                Taking an extra resident also needs supervisor sign-off.
              </p>
            )}

            <div className="mt-4 space-y-4">
              {dialog.kind === "add" && (
                <Select
                  label="Resident"
                  placeholder="Choose a resident…"
                  options={addable.map((p) => ({
                    value: String(p.id),
                    label: `${p.name} · Room ${p.room}`,
                  }))}
                  selectedKey={addId ?? undefined}
                  onSelectionChange={(key) => setAddId(String(key))}
                />
              )}
              <TextArea
                label="Reason for your supervisor"
                placeholder="Why this change is needed…"
                value={reason}
                onChange={setReason}
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" tone="neutral" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                tone={dialog.kind === "remove" ? "danger" : "accent"}
                disabled={
                  !reason.trim() || (dialog.kind === "add" && !addId)
                }
                onClick={
                  dialog.kind === "remove"
                    ? () => requestRemoval(dialog.patient)
                    : requestAddition
                }
              >
                Send request to supervisor
              </Button>
            </div>
          </Card>
        </OverlayPanel>
      )}
    </div>
  );
}
