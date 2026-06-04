import { AppBar, Button } from "@prysm/design-system";
import { Clock, LogIn } from "lucide-react";
import { useShift } from "../state/shiftContext";

// The first thing a CNA does: clock in. Sign-in and clock-in are separate — pay
// starts at clock-in, so it comes before reviewing the assignment, and the CNA
// can sign out / back in without clocking out. Clock in once per shift.
export default function ClockIn() {
  const { cna, clockIn } = useShift();

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      <AppBar
        tone="dark"
        className="flex-none"
        start={
          <span className="flex items-baseline gap-3">
            <span className="text-lg font-extrabold tracking-tight">Prysm</span>
            <span className="hidden text-sm font-medium text-neutral-400 sm:inline">1 North · Day Shift</span>
          </span>
        }
        end={
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-300">
            Signed in as {cna.name}
            <span className="grid h-8 w-8 place-items-center rounded-full bg-neutral-700 text-xs font-extrabold text-white">
              {cna.initials}
            </span>
          </span>
        }
      />

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-accent-50 text-accent-700">
            <Clock aria-hidden="true" className="h-8 w-8" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-accent-700">Start of shift</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-900">Clock in to start your shift</h1>
          <p className="mt-2 text-base text-neutral-600">
            You&rsquo;re signed in as <span className="font-semibold text-neutral-800">{cna.name}</span>.
            Clocking in starts your paid time and opens your assignment.
          </p>
          <Button className="mt-6" size="touch" iconLeft={LogIn} onClick={clockIn} data-testid="clock-in">
            Clock in
          </Button>
          <p className="mt-3 text-xs text-neutral-400">
            Clock in once per shift — you can sign out and back in without clocking out.
          </p>
        </div>
      </div>
    </div>
  );
}
