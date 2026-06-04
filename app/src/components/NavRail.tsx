import {
  ClipboardList,
  Clock,
  LayoutGrid,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { formatClock, useShift } from "../state/shiftContext";

export type NavView = "assignment" | "batch";

function NavButton({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      title={label}
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
        active ? "bg-neutral-800 text-white" : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
      }`}
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}

// The persistent global nav rail — shared by every in-shift screen so the menu
// never moves. Carries the time clock (the CNA is clocked in for the whole shift).
export default function NavRail({
  active,
  onNavigate,
}: {
  active: NavView;
  onNavigate: (view: NavView) => void;
}) {
  const { clockedInAt } = useShift();
  return (
    <nav className="flex w-16 flex-none flex-col items-center gap-1 bg-neutral-900 py-4">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-accent-600 text-sm font-extrabold text-white">
        1N
      </div>
      <NavButton icon={LayoutGrid} label="Assignment" active={active === "assignment"} onClick={() => onNavigate("assignment")} />
      <NavButton icon={ClipboardList} label="Batch tasks" active={active === "batch"} onClick={() => onNavigate("batch")} />
      <div className="mt-auto flex flex-col items-center gap-3">
        {clockedInAt && (
          <div
            title={`Clocked in at ${formatClock(clockedInAt)}`}
            className="flex flex-col items-center gap-0.5 text-neutral-400"
          >
            <Clock aria-hidden="true" className="h-5 w-5" />
            <span className="text-[10px] font-bold tabular-nums">{formatClock(clockedInAt)}</span>
          </div>
        )}
        <NavButton icon={Settings} label="Settings" />
      </div>
    </nav>
  );
}
