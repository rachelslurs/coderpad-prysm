import { useCallback, useEffect, useState } from "react";
import { DEFAULT_ANSWERS, type Answers } from "./answers";

const KEY = "prysm:prompt-builder:v1";

// Hydrate from localStorage, merged over defaults so a missing/renamed field
// (schema drift) never crashes a refresh.
function load(): Answers {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_ANSWERS;
    const parsed = JSON.parse(raw) as Partial<Answers>;
    return {
      ...DEFAULT_ANSWERS,
      ...parsed,
      urgentCriteria: {
        ...DEFAULT_ANSWERS.urgentCriteria,
        ...(parsed.urgentCriteria ?? {}),
      },
    };
  } catch {
    return DEFAULT_ANSWERS;
  }
}

export function useAnswers() {
  const [answers, setAnswers] = useState<Answers>(load);

  // Persist on every change so a refresh never loses interview notes.
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(answers));
    } catch {
      // ignore quota / private-mode write failures
    }
  }, [answers]);

  const update = useCallback((patch: Partial<Answers>) => {
    setAnswers((a) => ({ ...a, ...patch }));
  }, []);

  // Typed single-field setter for the dynamic question controls (no casts).
  const setField = useCallback(
    <K extends keyof Answers>(key: K, value: Answers[K]) => {
      setAnswers((a) => ({ ...a, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setAnswers(DEFAULT_ANSWERS), []);

  return { answers, update, setField, reset };
}
