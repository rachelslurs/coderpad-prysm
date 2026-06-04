// state/shift.tsx — shift-wide provider for the CNA flow.
//
// Holds whether the CNA has clocked in. Sign-in and clock-in are separate actions:
// you clock in once per shift and can sign out / back in without clocking out.
// The context + hook live in `shiftContext.ts`; documentation + corrections grow
// this in a later PR.
import { useState, type ReactNode } from "react";
import { CNA, ShiftContext } from "./shiftContext";

export function ShiftProvider({ children }: { children: ReactNode }) {
  const [clockedInAt, setClockedInAt] = useState<Date | null>(null);
  // Clock in once per shift — a second press is a no-op.
  const clockIn = () => setClockedInAt((prev) => prev ?? new Date());
  return (
    <ShiftContext.Provider value={{ cna: CNA, clockedInAt, clockIn }}>{children}</ShiftContext.Provider>
  );
}
