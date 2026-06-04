import { ProgressBar } from "react-aria-components";
import type { Tone } from "../types";

const BAR_FILL: Record<Tone, string> = {
  neutral: "bg-neutral-500",
  accent: "bg-accent-600",
  info: "bg-info-600",
  success: "bg-success-600",
  warning: "bg-warning-600",
  danger: "bg-danger-600",
};

const RING_STROKE: Record<Tone, string> = {
  neutral: "stroke-neutral-500",
  accent: "stroke-accent-600",
  info: "stroke-info-600",
  success: "stroke-success-600",
  warning: "stroke-warning-600",
  danger: "stroke-danger-600",
};

export type TaskProgressProps = {
  value: number;
  total: number;
  variant?: "ring" | "bar";
  tone?: Tone;
  /** Ring diameter in px (ring variant only). */
  size?: number;
  /** Accessible label; also shown above the bar variant. */
  label?: string;
};

// "3 / 6" task progress. Ring for cards, bar for rows. Wraps react-aria-components
// ProgressBar for role=progressbar + aria-value*/valuetext; renders custom visuals.
export default function TaskProgress({
  value,
  total,
  variant = "ring",
  tone = "accent",
  size = 64,
  label,
}: TaskProgressProps) {
  const pct = total > 0 ? Math.min(1, Math.max(0, value / total)) : 0;
  const count = (
    <>
      {value}
      <span className="text-neutral-500">/{total}</span>
    </>
  );

  return (
    <ProgressBar
      value={value}
      minValue={0}
      maxValue={total}
      aria-label={label ?? `${value} of ${total} tasks`}
    >
      {variant === "ring" ? (
        <div
          className="relative inline-flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
          >
            {(() => {
              const stroke = 8;
              const r = (size - stroke) / 2;
              const c = 2 * Math.PI * r;
              return (
                <>
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={stroke}
                    className="stroke-neutral-200"
                  />
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - pct)}
                    className={RING_STROKE[tone]}
                  />
                </>
              );
            })()}
          </svg>
          <span className="absolute text-[15px] font-bold tabular-nums text-neutral-900">
            {count}
          </span>
        </div>
      ) : (
        <div className="w-full">
          <div className="mb-1 flex justify-between text-xs font-semibold text-neutral-600">
            <span>{label ?? "Tasks"}</span>
            <span className="font-bold tabular-nums text-neutral-900">
              {value} / {total}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div
              className={`h-full rounded-full ${BAR_FILL[tone]}`}
              style={{ width: `${pct * 100}%` }}
            />
          </div>
        </div>
      )}
    </ProgressBar>
  );
}
