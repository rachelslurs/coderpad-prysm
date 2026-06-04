import type { ReactNode } from "react";
import {
  Select as AriaSelect,
  Label,
  Button,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  Text,
  FieldError,
  type SelectProps as AriaSelectProps,
} from "react-aria-components";
import { Check, ChevronDown } from "lucide-react";
import { FIELD, LABEL, DESC, ERROR } from "../TextInput/TextInput";

type Option = string | { value: string; label: ReactNode };

const toOption = (o: Option) =>
  typeof o === "string" ? { value: o, label: o } : o;

const TRIGGER =
  "flex w-full min-h-12 items-center justify-between gap-2 rounded-lg border-[1.5px] border-neutral-300 bg-white px-3 text-base text-neutral-900 outline-none transition-colors data-[focus-visible]:border-accent-600 data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-accent-600/35 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";

const POPOVER =
  "w-[var(--trigger-width)] rounded-lg border border-neutral-200 bg-white p-1 shadow-lg outline-none";

const ITEM =
  "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-base text-neutral-900 outline-none data-[focused]:bg-accent-50 data-[selected]:font-semibold";

export type SelectProps = Omit<
  AriaSelectProps<object>,
  "className" | "children"
> & {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  /** Choices — strings or `{ value, label }`. */
  options: Option[];
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  className?: string;
};

// A single-select dropdown. react-aria `Select` gives a listbox popover with
// typeahead, keyboard nav, and label/validation wiring; visuals are ours.
export default function Select({
  label,
  description,
  errorMessage,
  options,
  placeholder = "Select…",
  className = "",
  ...props
}: SelectProps) {
  return (
    <AriaSelect
      {...props}
      placeholder={placeholder}
      className={`${FIELD} ${className}`.trim()}
    >
      {label != null && <Label className={LABEL}>{label}</Label>}
      <Button className={TRIGGER}>
        <SelectValue className="data-[placeholder]:text-neutral-400" />
        <ChevronDown
          className="h-4 w-4 flex-none text-neutral-500"
          aria-hidden="true"
        />
      </Button>
      {description != null && (
        <Text slot="description" className={DESC}>
          {description}
        </Text>
      )}
      <FieldError className={ERROR}>{errorMessage}</FieldError>
      <Popover className={POPOVER}>
        <ListBox className="max-h-60 overflow-auto outline-none">
          {options.map(toOption).map((o) => (
            <ListBoxItem
              key={o.value}
              id={o.value}
              textValue={typeof o.label === "string" ? o.label : o.value}
              className={ITEM}
            >
              {({ isSelected }) => (
                <>
                  <span>{o.label}</span>
                  {isSelected && (
                    <Check
                      className="h-4 w-4 flex-none text-accent-600"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
