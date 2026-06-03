import type { KeyboardEvent } from "react";
import { NumberField, Group, Input, Button } from "react-aria-components";
import { Minus, Plus, History } from "lucide-react";

export type StepperProps = {
  /** `null`/`undefined` = unset (step mode shows "Not set"). */
  value?: number | null;
  defaultValue?: number;
  onChange?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  /** Trailing unit label (e.g. "°F", "mL"). */
  unit?: string;
  /** "input" = typed or stepped; "step" = step-only (no freeform typing). */
  mode?: "input" | "step";
  /** Step mode: the last reading. The first +/− seeds to this, and a
   *  "Use last" affordance appears while unset. */
  seed?: number;
  /** Accessible label. */
  label: string;
};

const BTN =
  "flex h-[52px] w-[52px] shrink-0 items-center justify-center bg-white text-accent-600 outline-none transition-colors hover:bg-accent-50 data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-inset data-[focus-visible]:ring-accent-600/35 data-[disabled]:cursor-not-allowed data-[disabled]:text-neutral-400 data-[disabled]:hover:bg-white";

const INPUT =
  "h-[52px] w-[92px] border-x-[1.5px] border-neutral-100 text-center text-2xl font-extrabold tabular-nums text-neutral-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none read-only:cursor-default data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-inset data-[focus-visible]:ring-accent-600/35";

const GROUP =
  "inline-flex items-center overflow-hidden rounded-lg border-[1.5px] border-neutral-300";

// Structured numeric input — never freeform.
// - mode="input": react-aria-components NumberField (textbox, clamps/rounds/locale).
// - mode="step": a custom spinbutton — step-only, with an unset state ("Not set"
//   until touched) and a `seed` (the last reading) that the first +/− jumps to.
export default function Stepper({
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  step = 1,
  unit,
  mode = "input",
  seed,
  label,
}: StepperProps) {
  if (mode === "input") {
    return (
      <NumberField
        value={value ?? undefined}
        defaultValue={defaultValue}
        onChange={onChange}
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        aria-label={label}
        className="inline-flex items-center"
      >
        <Group className={GROUP}>
          <Button slot="decrement" className={BTN}>
            <Minus className="h-[22px] w-[22px]" aria-hidden="true" />
          </Button>
          <Input className={INPUT} />
          <Button slot="increment" className={BTN}>
            <Plus className="h-[22px] w-[22px]" aria-hidden="true" />
          </Button>
        </Group>
        {unit != null && (
          <span className="ml-2 text-sm font-bold text-neutral-500">{unit}</span>
        )}
      </NumberField>
    );
  }

  // ── step-only spinbutton ────────────────────────────────────────────────
  const isSet = value != null && !Number.isNaN(value);
  const min = minValue ?? -Infinity;
  const max = maxValue ?? Infinity;
  const roundToStep = (v: number) => {
    const inv = 1 / step;
    return Math.round(v * inv) / inv;
  };
  const commit = (v: number) => onChange?.(Math.min(max, Math.max(min, roundToStep(v))));
  // First press jumps to the last reading (or the min / 0); then it steps from there.
  const seedValue = seed ?? (min === -Infinity ? 0 : min);
  const onStep = (dir: 1 | -1) =>
    isSet ? commit((value as number) + dir * step) : commit(seedValue);
  const atMin = isSet && (value as number) <= min;
  const atMax = isSet && (value as number) >= max;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowUp":
      case "PageUp":
        e.preventDefault();
        onStep(1);
        break;
      case "ArrowDown":
      case "PageDown":
        e.preventDefault();
        onStep(-1);
        break;
      case "Home":
        if (minValue != null) {
          e.preventDefault();
          commit(minValue);
        }
        break;
      case "End":
        if (maxValue != null) {
          e.preventDefault();
          commit(maxValue);
        }
        break;
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div role="group" aria-label={label} className={GROUP}>
        <Button isDisabled={atMin} onPress={() => onStep(-1)} aria-label="decrease" className={BTN}>
          <Minus className="h-[22px] w-[22px]" aria-hidden="true" />
        </Button>
        <div
          role="spinbutton"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={minValue}
          aria-valuemax={maxValue}
          aria-valuenow={isSet ? (value as number) : undefined}
          aria-valuetext={isSet ? `${value}${unit ?? ""}` : "Not set"}
          onKeyDown={onKeyDown}
          className={`flex h-[52px] min-w-[92px] items-center justify-center px-2 text-center tabular-nums outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-accent-600/35 ${
            isSet
              ? "text-2xl font-extrabold text-neutral-900"
              : "text-base font-bold text-neutral-400"
          }`}
        >
          {isSet ? value : "Not set"}
        </div>
        <Button isDisabled={atMax} onPress={() => onStep(1)} aria-label="increase" className={BTN}>
          <Plus className="h-[22px] w-[22px]" aria-hidden="true" />
        </Button>
      </div>
      {isSet && unit != null && (
        <span className="text-sm font-bold text-neutral-500">{unit}</span>
      )}
      {!isSet && seed != null && (
        <button
          type="button"
          onClick={() => commit(seed)}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border-[1.5px] border-neutral-300 bg-white px-3 text-sm font-bold text-accent-600 hover:bg-accent-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
        >
          <History className="h-3.5 w-3.5" aria-hidden="true" />
          Use last {seed}
          {unit ?? ""}
        </button>
      )}
    </div>
  );
}
