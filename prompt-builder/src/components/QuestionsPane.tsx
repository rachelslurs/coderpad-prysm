import { useEffect, useMemo, useState } from "react";
import { Card, Segmented, TextArea } from "@prysm/design-system";
import { CLEARED, QUESTIONS, isAnswered, type Answers, type Question } from "../answers";
import QuestionCard from "./QuestionCard";

type Props = {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  setField: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
};

type SortMode = "fixed" | "answered";
const SORT_KEY = "prysm:prompt-builder:sort";
const ORDER_OPTIONS = ["In order", "Answered first"];

// Left pane: the always-visible catch-all, then the question list. By default
// questions stay in a FIXED order — answering one never makes it jump. The
// "Answered first" toggle opts into grouping answered questions to the top.
export default function QuestionsPane({ answers, update, setField }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [sortMode, setSortMode] = useState<SortMode>(() => {
    try {
      return localStorage.getItem(SORT_KEY) === "answered" ? "answered" : "fixed";
    } catch {
      return "fixed";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(SORT_KEY, sortMode);
    } catch {
      // ignore write failures
    }
  }, [sortMode]);

  const answeredCount = QUESTIONS.filter((q) => isAnswered(q, answers)).length;

  const ordered = useMemo(() => {
    if (sortMode === "fixed") return QUESTIONS;
    return [
      ...QUESTIONS.filter((q) => isAnswered(q, answers)),
      ...QUESTIONS.filter((q) => !isAnswered(q, answers)),
    ];
  }, [sortMode, answers]);

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

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Questions · {answeredCount}/{QUESTIONS.length} answered
          </span>
          <Segmented
            label="Question order"
            variant="segmented"
            options={ORDER_OPTIONS}
            value={sortMode === "answered" ? "Answered first" : "In order"}
            onChange={(label) => setSortMode(label === "Answered first" ? "answered" : "fixed")}
          />
        </div>

        <div className="flex flex-col gap-2">
          {ordered.map((q) => {
            const ans = isAnswered(q, answers);
            if (ans || expanded.has(q.id)) {
              return (
                <Card key={q.id} padding="none">
                  <QuestionCard
                    q={q}
                    answers={answers}
                    update={update}
                    setField={setField}
                    answered={ans}
                    onClear={ans ? () => clearQuestion(q) : undefined}
                    onCollapse={!ans ? () => collapse(q.id) : undefined}
                  />
                </Card>
              );
            }
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => expand(q.id)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-neutral-300 hover:bg-neutral-50"
              >
                <span className="text-sm font-semibold text-neutral-700">{q.label}</span>
                <span className="text-xs text-neutral-400">{q.hint}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
