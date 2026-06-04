import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Card, Segmented, TextArea } from "@prysm/design-system";
import {
  CLEARED,
  QUESTIONS,
  STAGES,
  isAnswered,
  isVisible,
  type Answers,
  type Question,
} from "../answers";
import QuestionCard from "./QuestionCard";

type Props = {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  setField: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
};

type SortMode = "fixed" | "answered";
const SORT_KEY = "prysm:prompt-builder:sort";
const ORDER_OPTIONS = ["In order", "Answered first"];

// Left pane: the always-visible catch-all, then the stage-grouped question list.
// Stage headings and their order are FIXED so the form mirrors the interview
// flow. The "Answered first" toggle only reorders questions WITHIN a stage.
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

  // Only the questions currently revealed (e.g. the Assignment Selection
  // sub-questions appear once the opt-in toggle is on) count toward progress.
  const visible = useMemo(() => QUESTIONS.filter((q) => isVisible(q, answers)), [answers]);
  const answeredCount = visible.filter((q) => isAnswered(q, answers)).length;

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

  // Questions in one stage, optionally floating answered ones to the top.
  const stageQuestions = (title: string): Question[] => {
    const inStage = visible.filter((q) => q.group === title);
    if (sortMode === "fixed") return inStage;
    return [
      ...inStage.filter((q) => isAnswered(q, answers)),
      ...inStage.filter((q) => !isAnswered(q, answers)),
    ];
  };

  const renderQuestion = (q: Question): ReactNode => {
    const ans = isAnswered(q, answers);
    // A toggle is always shown open — it's the gate for its stage, never collapsed.
    const alwaysOpen = q.kind === "toggle";
    if (ans || alwaysOpen || expanded.has(q.id)) {
      return (
        <Card key={q.id} padding="none">
          <QuestionCard
            q={q}
            answers={answers}
            update={update}
            setField={setField}
            answered={ans}
            onClear={ans && !alwaysOpen ? () => clearQuestion(q) : undefined}
            onCollapse={!ans && !alwaysOpen ? () => collapse(q.id) : undefined}
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
            Questions · {answeredCount}/{visible.length} answered
          </span>
          <Segmented
            label="Order within stage"
            variant="segmented"
            options={ORDER_OPTIONS}
            value={sortMode === "answered" ? "Answered first" : "In order"}
            onChange={(label) => setSortMode(label === "Answered first" ? "answered" : "fixed")}
          />
        </div>

        <div className="flex flex-col gap-6">
          {STAGES.map((stage) => {
            const qs = stageQuestions(stage.title);
            if (qs.length === 0) return null;
            return (
              <section key={stage.title} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    {stage.title}
                  </h3>
                  {stage.hint ? (
                    <span className="text-[11px] text-neutral-400">{stage.hint}</span>
                  ) : null}
                </div>
                {qs.map(renderQuestion)}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
