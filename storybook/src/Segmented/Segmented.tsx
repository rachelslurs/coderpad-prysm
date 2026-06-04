import type { ReactNode } from "react";
import { RadioGroup, Radio } from "react-aria-components";
import { Check } from "lucide-react";

type Option = string | { value: string; label: ReactNode };

export type SegmentedProps = {
  /** The choices. A bare string is both value and label; pass
   *  `{ value, label }` when they differ. */
  options: Option[];
  /** Selected value (controlled). Exactly one option is selected at a time. */
  value?: string;
  /** Initial selected value (uncontrolled). */
  defaultValue?: string;
  /** Fires with the newly-selected value. Selecting one option deselects the
   *  previous — this is single-select. */
  onChange?: (value: string) => void;
  /** Skin (both are single-select): `segmented` = compact thumb track for 2–4
   *  short options; `picker` = wrapped chips with a check badge, for longer or
   *  more numerous options. */
  variant?: "segmented" | "picker";
  /** Accessible group name (required — labels the radio group). */
  label: string;
};

const toOption = (o: Option) =>
  typeof o === "string" ? { value: o, label: o } : o;

const GROUP = {
  segmented: "inline-flex gap-1 rounded-[10px] bg-neutral-100 p-1",
  picker: "flex flex-wrap gap-3",
} as const;

const OPTION = {
  segmented:
    "inline-flex min-h-11 cursor-pointer select-none items-center justify-center rounded-[7px] px-[18px] text-[15px] font-bold text-neutral-600 outline-none transition data-[selected]:bg-white data-[selected]:text-accent-600 data-[selected]:shadow-sm data-[selected]:ring-[1.5px] data-[selected]:ring-inset data-[selected]:ring-accent-600 data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-accent-600/35",
  picker:
    "relative inline-flex min-h-11 cursor-pointer select-none items-center justify-center rounded-lg border-[1.5px] border-neutral-300 bg-white px-[18px] text-sm font-semibold text-neutral-900 outline-none transition data-[selected]:border-accent-600 data-[selected]:bg-accent-50 data-[selected]:text-accent-800 data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-accent-600/35",
} as const;

// Exclusive single-choice control. One radio-group core (react-aria-components
// RadioGroup/Radio — roving tab stop, arrow keys, role=radiogroup), two skins.
export default function Segmented({
  options,
  variant = "segmented",
  label,
  ...props
}: SegmentedProps) {
  return (
    <RadioGroup {...props} aria-label={label} className={GROUP[variant]}>
      {options.map(toOption).map((o) => (
        <Radio key={o.value} value={o.value} className={OPTION[variant]}>
          {({ isSelected }) => (
            <>
              {o.label}
              {variant === "picker" && isSelected && (
                <span className="absolute -right-2 -top-2 inline-flex h-[21px] w-[21px] items-center justify-center rounded-full border-2 border-white bg-accent-600 text-white">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
              )}
            </>
          )}
        </Radio>
      ))}
    </RadioGroup>
  );
}
