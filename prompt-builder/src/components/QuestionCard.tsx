import { Badge, Button, FormField, Segmented, Select, TextInput, Toggle } from "@prysm/design-system";
import { Check, X } from "lucide-react";
import { URGENT_OPTIONS, type Answers, type Question } from "../answers";

type Update = (patch: Partial<Answers>) => void;
type SetField = <K extends keyof Answers>(key: K, value: Answers[K]) => void;

type Props = {
  q: Question;
  answers: Answers;
  update: Update;
  setField: SetField;
  answered: boolean;
  onClear?: () => void;
  onCollapse?: () => void;
};

// Multi-select (urgentCriteria): toggle chips built from Button per the design
// system's own guidance ("for a clickable chip, use Button"), plus a free-text
// "other".
function MultiSelect({ value, update }: { value: Answers["urgentCriteria"]; update: Update }) {
  const toggle = (opt: string) => {
    const selected = value.selected.includes(opt)
      ? value.selected.filter((x) => x !== opt)
      : [...value.selected, opt];
    update({ urgentCriteria: { ...value, selected } });
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {URGENT_OPTIONS.map((opt) => {
          const on = value.selected.includes(opt);
          return (
            <Button
              key={opt}
              size="sm"
              variant={on ? "solid" : "outline"}
              tone={on ? "accent" : "neutral"}
              aria-pressed={on}
              onClick={() => toggle(opt)}
            >
              {opt}
            </Button>
          );
        })}
      </div>
      <TextInput
        aria-label="Other needs-attention criteria"
        placeholder="other (free text)"
        value={value.other}
        onChange={(other) => update({ urgentCriteria: { ...value, other } })}
      />
    </div>
  );
}

function Control({ q, answers, update, setField }: Pick<Props, "q" | "answers" | "update" | "setField">) {
  if (q.kind === "multi") {
    return <MultiSelect value={answers.urgentCriteria} update={update} />;
  }
  if (q.kind === "toggle") {
    const on = Boolean(answers[q.id]);
    return (
      <Toggle isSelected={on} onChange={(v) => setField(q.id, v)}>
        {on ? "Included" : "Skip (toggle to include)"}
      </Toggle>
    );
  }
  if (q.kind === "text") {
    return (
      <TextInput
        aria-label={q.label}
        placeholder={q.hint}
        value={(answers[q.id] as string | undefined) ?? ""}
        onChange={(v) => setField(q.id, v)}
      />
    );
  }
  // single-select
  if (q.control === "select") {
    return (
      <Select
        aria-label={q.label}
        options={q.options ?? []}
        placeholder="Select…"
        selectedKey={(answers[q.id] as string | undefined) ?? null}
        onSelectionChange={(k) => setField(q.id, String(k))}
      />
    );
  }
  return (
    <Segmented
      label={q.label}
      variant="picker"
      options={q.options ?? []}
      value={answers[q.id] as string | undefined}
      onChange={(v) => setField(q.id, v)}
    />
  );
}

// One question row: FormField owns the label + (when answered) a status badge;
// the matching design-system control sits below, with an optional detail field
// and a Clear/Collapse affordance.
export default function QuestionCard({ q, answers, update, setField, answered, onClear, onCollapse }: Props) {
  // The toggle is its own affordance — no detail escape-hatch, no clear/collapse.
  const isToggle = q.kind === "toggle";
  const detail = isToggle ? undefined : q.detailField;
  return (
    <FormField
      label={q.label}
      hint={
        answered ? (
          <Badge tone="success" size="sm" icon={Check}>
            Answered
          </Badge>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-3">
        <Control q={q} answers={answers} update={update} setField={setField} />

        {detail && answers[q.id] ? (
          <TextInput
            aria-label={q.detailLabel ?? "Detail"}
            placeholder={q.detailLabel}
            value={answers[detail]}
            onChange={(v) => setField(detail, v)}
          />
        ) : null}

        {isToggle ? null : answered ? (
          <div className="flex justify-end">
            <Button variant="ghost" tone="danger" size="sm" iconLeft={X} onClick={onClear}>
              Clear
            </Button>
          </div>
        ) : onCollapse ? (
          <div className="flex justify-end">
            <Button variant="ghost" tone="neutral" size="sm" onClick={onCollapse}>
              Collapse
            </Button>
          </div>
        ) : null}
      </div>
    </FormField>
  );
}
