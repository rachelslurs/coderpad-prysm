// state/shift.tsx — shift-wide provider for the CNA flow.
//
// Holds whether the CNA has clocked in and the documentation logged this shift.
// Sign-in and clock-in are separate actions: you clock in once per shift and can
// sign out / back in without clocking out. The context + hook live in
// `shiftContext.ts`.
import { useState, type ReactNode } from "react";
import { seedInitialLog, type LogEntry } from "../../data/careTasks";
import { CNA, ShiftContext } from "./shiftContext";

export function ShiftProvider({ children }: { children: ReactNode }) {
  const [clockedInAt, setClockedInAt] = useState<Date | null>(null);
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => seedInitialLog(CNA.id, Date.now()));

  // Clock in once per shift — a second press is a no-op.
  const clockIn = () => setClockedInAt((prev) => prev ?? new Date());

  // Append-only: documentation is never overwritten in place (corrections strike
  // out rather than delete — a later PR).
  const logEntry = (entry: { residentId: number; taskId: string; value: string }) => {
    const at = Date.now();
    setLogEntries((prev) => [...prev, { ...entry, id: `${entry.residentId}-${entry.taskId}-${at}`, by: CNA.id, at }]);
  };

  return (
    <ShiftContext.Provider value={{ cna: CNA, clockedInAt, clockIn, logEntries, logEntry }}>
      {children}
    </ShiftContext.Provider>
  );
}
