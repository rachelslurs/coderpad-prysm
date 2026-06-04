import { useState } from "react";
import { Card, Section, TextArea } from "@prysm/design-system";
import { CLEARED, QUESTIONS, isAnswered, type Answers, type Question } from "../answers";
import QuestionCard from "./QuestionCard";

type Props = {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  setField: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
};

// Left pane: the always-visible catch-all, then answered questions floated to
// the top, then a compact, de-emphasized list of the rest (click to expand).
export default function QuestionsPane({ answers, update, setField }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const answered = QUESTIONS.filter((q) => isAnswered(q, answers));
  const unanswered = QUESTIONS.filter((q) => !isAnswered(q, answers));

  const expand = (id: string) => setExpanded((s) => new Set(s).add(id));
  const collapse = (id: string) =>
    setExpanded((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });

  const clearQuestion = (q: Question) => {
    setField(q.id, CLEARED[q.id]);
    if (q.detailField) setField(q.detailField, "");
    collapse(q.id);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Always-visible catch-all → drives the Notes block */}
      <TextArea
        label="Anything else — catch-all"
        rows={4}
        placeholder="Anything from the interview that maps to no field above…"
        value={answers.freeText}
        onChange={(freeText) => update({ freeText })}
      />

      <Section title="Answered" count={answered.length} tone="success">
        {answered.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Nothing answered yet — tag answers as the interview goes.
          </p>
        ) : (
          <Card padding="none" className="divide-y divide-neutral-100">
            {answered.map((q) => (
              <QuestionCard
                key={q.id}
                q={q}
                answers={answers}
                update={update}
                setField={setField}
                answered
                onClear={() => clearQuestion(q)}
              />
            ))}
          </Card>
        )}
      </Section>

      <Section title="Not yet answered" count={unanswered.length} tone="neutral">
        {unanswered.length === 0 ? (
          <p className="text-sm text-neutral-500">Everything's answered.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {unanswered.map((q) =>
              expanded.has(q.id) ? (
                <Card key={q.id} padding="none">
                  <QuestionCard
                    q={q}
                    answers={answers}
                    update={update}
                    setField={setField}
                    answered={false}
                    onCollapse={() => collapse(q.id)}
                  />
                </Card>
              ) : (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => expand(q.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <span className="text-sm font-semibold text-neutral-700">{q.label}</span>
                  <span className="text-xs text-neutral-400">{q.hint}</span>
                </button>
              ),
            )}
          </div>
        )}
      </Section>
    </div>
  );
}
