import { useState } from "react";
import { Button, Card, OverlayPanel, Segmented, Select, Stepper } from "@prysm/design-system";
import { Check, History } from "lucide-react";
import type { DocTask, LogEntry } from "../../data/careTasks";
import { formatClock } from "../state/shiftContext";

type TaskInputProps = {
  task: DocTask;
  /** The latest logged entry for this resident's task, if any. */
  entry?: LogEntry;
  onLog: (value: string) => void;
  /** Strike out the current entry (correction). Omit to hide the affordance. */
  onStrike?: (reason: string) => void;
};

// Strike-out reasons — structured, not freeform.
const STRIKE_REASONS = ["Data-entry error", "Wrong resident or chart", "Updated assessment", "Other"];

// A "Logged HH:MM · value" chip shown once a task has an entry.
function LoggedChip({ entry }: { entry: LogEntry }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-bold text-success-700">
      <Check aria-hidden="true" className="h-3.5 w-3.5" />
      Logged {formatClock(new Date(entry.at))} · {entry.value}
    </span>
  );
}

// Read-only "last recorded / normal" reference. CNAs can view it, not pull it in
// (pulling another's reading is a nurse-only, HIPAA-scoped action).
function Reference({ last, normal }: { last: string; normal: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-md bg-neutral-50 px-3 py-2">
      <div>
        <div className="text-xs font-semibold text-neutral-400">Last recorded</div>
        <div className="text-sm font-bold text-neutral-700">{last}</div>
      </div>
      <div>
        <div className="text-xs font-semibold text-neutral-400">Normal (reference)</div>
        <div className="text-sm font-bold text-neutral-700">{normal}</div>
      </div>
    </div>
  );
}

// One structured documentation input — segmented choices, vitals steppers, or
// fixed meal items. No freeform text. Records a timestamped entry on log.
export default function TaskInput({ task, entry, onLog, onStrike }: TaskInputProps) {
  // Choice / meal seed their control from the last entry; vitals re-enter fresh.
  const seeded =
    task.kind === "choice" && entry && task.options.includes(entry.value)
      ? entry.value
      : task.kind === "meal" && entry && task.amounts.includes(entry.value)
        ? entry.value
        : "";
  const [choice, setChoice] = useState(seeded);
  const [vitals, setVitals] = useState<Record<string, number | null>>({});
  const [striking, setStriking] = useState(false);
  const [strikeReason, setStrikeReason] = useState("");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-extrabold text-neutral-900">{task.label}</h3>
        {entry && (
          <div className="flex items-center gap-2">
            <LoggedChip entry={entry} />
            {onStrike && (
              <button
                type="button"
                onClick={() => setStriking(true)}
                className="rounded text-xs font-bold text-accent-700 underline-offset-2 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
              >
                Correct
              </button>
            )}
          </div>
        )}
      </div>

      {striking && (
        <OverlayPanel
          onClose={() => setStriking(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Correct this entry"
          className="items-center justify-center bg-neutral-950/50 p-6 backdrop-blur-sm"
        >
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-extrabold text-neutral-900">Correct this entry</h2>
            <p className="mt-1 text-sm text-neutral-600">
              No deletes — the original stays on the record with a line through it. Choose a reason, then log
              the corrected value.
            </p>
            <div className="mt-4">
              <Select
                label="Reason"
                placeholder="Choose a reason…"
                options={STRIKE_REASONS}
                selectedKey={strikeReason || undefined}
                onSelectionChange={(k) => setStrikeReason(String(k))}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" tone="neutral" onClick={() => setStriking(false)}>
                Cancel
              </Button>
              <Button
                tone="danger"
                disabled={!strikeReason}
                onClick={() => {
                  onStrike?.(strikeReason);
                  setStriking(false);
                  setStrikeReason("");
                  setChoice("");
                  setVitals({});
                }}
              >
                Strike out
              </Button>
            </div>
          </Card>
        </OverlayPanel>
      )}

      {task.kind === "vitals" && (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {task.fields.map((f) => (
              <div key={f.id}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-neutral-700">{f.label}</span>
                  <span className="text-xs text-neutral-400">Normal {f.normal}</span>
                </div>
                <Stepper
                  label={f.label}
                  mode="step"
                  value={vitals[f.id] ?? null}
                  onChange={(n) => setVitals((s) => ({ ...s, [f.id]: n }))}
                  minValue={f.min}
                  maxValue={f.max}
                  step={f.step}
                  unit={f.unit}
                />
              </div>
            ))}
          </div>
          <div className="rounded-md bg-neutral-50 px-3 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500">
              <History aria-hidden="true" className="h-3.5 w-3.5" /> Recent
            </div>
            <ul className="space-y-0.5 text-sm text-neutral-600">
              {task.recent.map((r) => (
                <li key={r.at}>
                  <span className="tabular-nums text-neutral-400">{r.at}</span> · {r.summary}
                </li>
              ))}
            </ul>
          </div>
          <Button
            size="touch"
            disabled={task.fields.some((f) => vitals[f.id] == null)}
            onClick={() =>
              onLog(
                `${vitals.sys}/${vitals.dia} · HR ${vitals.hr} · ${vitals.spo2}%`
              )
            }
          >
            Log vitals
          </Button>
        </>
      )}

      {task.kind === "choice" && (
        <>
          <Segmented variant="picker" label={task.label} options={task.options} value={choice} onChange={setChoice} />
          <Reference last={task.last} normal={task.normal} />
          <Button size="touch" disabled={!choice} onClick={() => onLog(choice)}>
            {entry ? "Update" : "Log"}
          </Button>
        </>
      )}

      {task.kind === "meal" && (
        <>
          <div className="text-sm text-neutral-600">
            <span className="font-semibold text-neutral-700">Served:</span> {task.items.join(" · ")}
          </div>
          <Segmented variant="picker" label="Intake" options={task.amounts} value={choice} onChange={setChoice} />
          <Reference last={task.last} normal={task.normal} />
          <Button size="touch" disabled={!choice} onClick={() => onLog(choice)}>
            {entry ? "Update" : "Log meal"}
          </Button>
        </>
      )}
    </div>
  );
}
