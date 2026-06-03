import type { ReactNode } from "react";
import { NumberField, Group, Input, Button } from "react-aria-components";
import { Minus, Plus } from "lucide-react";

export type StepperProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  /** Trailing unit (e.g. "°F", "mL"). */
  unit?: ReactNode;
  /** "input" = typed or stepped; "step" = step-only (no freeform typing). */
  mode?: "input" | "step";
  /** Accessible label. */
  label: string;
};

const BTN =
  "flex h-[52px] w-[52px] shrink-0 items-center justify-center bg-white text-accent-600 outline-none transition-colors hover:bg-accent-50 data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-inset data-[focus-visible]:ring-accent-600/35 data-[disabled]:cursor-not-allowed data-[disabled]:text-neutral-400 data-[disabled]:hover:bg-white";

const INPUT =
  "h-[52px] w-[92px] border-x-[1.5px] border-neutral-100 text-center text-2xl font-extrabold tabular-nums text-neutral-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none read-only:cursor-default data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-inset data-[focus-visible]:ring-accent-600/35";

// Structured numeric input — react-aria-components NumberField (spinbutton role,
// arrow keys, clamps to [min,max], rounds to step, locale-aware). Never freeform:
// `mode="step"` makes the value read-only (steppers only).
export default function Stepper({
  unit,
  mode = "input",
  label,
  ...props
}: StepperProps) {
  return (
    <NumberField {...props} aria-label={label} className="inline-flex items-center">
      <Group className="inline-flex items-center overflow-hidden rounded-lg border-[1.5px] border-neutral-300">
        <Button slot="decrement" className={BTN}>
          <Minus className="h-[22px] w-[22px]" aria-hidden="true" />
        </Button>
        <Input readOnly={mode === "step"} className={INPUT} />
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
