// state/shiftContext.ts — shift context + hook (non-component, so it lives apart
// from the provider component for fast-refresh).
import { createContext, useContext } from "react";
import type { LogEntry } from "../../data/careTasks";

export type Cna = { id: string; name: string; initials: string };

export const CNA: Cna = { id: "mclaughlin", name: "Jenna McLaughlin", initials: "JM" };

export type ShiftContextValue = {
  cna: Cna;
  /** When the CNA clocked in (paid time starts). `null` until they do. */
  clockedInAt: Date | null;
  clockIn: () => void;
  /** Documentation logged this shift. */
  logEntries: LogEntry[];
  /** Record a structured task value (stamped with the CNA + time). */
  logEntry: (entry: { residentId: number; taskId: string; value: string }) => void;
};

export const ShiftContext = createContext<ShiftContextValue | null>(null);

export function useShift(): ShiftContextValue {
  const ctx = useContext(ShiftContext);
  if (!ctx) throw new Error("useShift must be used within a ShiftProvider");
  return ctx;
}

/** Wall-clock time as HH:MM. */
export const formatClock = (d: Date): string =>
  d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
